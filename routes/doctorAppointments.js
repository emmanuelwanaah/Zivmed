const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const sendPaymentSuccessEmail = require("../utils/sendPaymentSuccessEmail");
const sendAppointmentStatusEmail = require("../utils/status"); // adjust path if needed
// ✅ Middleware for doctor auth
function doctorAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "doctor") return res.status(403).json({ error: "Unauthorized" });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// GET pending appointments for logged-in doctor
// GET all appointments (for doctor view)
// GET pending appointments for logged-in doctor
router.get("/", doctorAuth, async (req, res) => {
    try {
      // Find doctor id
      const [doctorRows] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [req.user.id]);
      if (doctorRows.length === 0) return res.status(403).json({ error: "Doctor not found" });
  
      const doctorId = doctorRows[0].id;
  
      const query = `
      SELECT 
        a.id, 
        a.patient_name, 
        a.patient_email, 
        a.status,
        a.created_at,        -- ✅ USE THIS
        s.service_name,
        u.full_name AS doctor_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      JOIN services s ON a.service_id = s.id
      WHERE a.doctor_id = ?
      ORDER BY a.id DESC
    `;
      const [results] = await db.query(query, [doctorId]);
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

// Approve appointment
const axios = require("axios");
const sendPaymentEmail = require("../utils/sendPaymentEmail"); // create this

router.put("/approve/:id", doctorAuth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ error: "Amount required" });

    // get doctor
    const [doctorRows] = await db.query(
      "SELECT id FROM doctors WHERE user_id = ?",
      [req.user.id]
    );

    if (!doctorRows.length)
      return res.status(403).json({ error: "Doctor not found" });

    const doctorId = doctorRows[0].id;

    // get appointment
    const [appointments] = await db.query(
      `SELECT * FROM appointments WHERE id=? AND doctor_id=?`,
      [req.params.id, doctorId]
    );

    if (!appointments.length)
      return res.status(404).json({ error: "Appointment not found" });

    const appointment = appointments[0];

    // 🔥 create unique reference
    const reference = "PAY_" + Date.now();

    // 🔥 create payment record
    await db.query(
      `INSERT INTO payments 
       (appointment_id, amount, provider, transaction_reference, payment_status)
       VALUES (?, ?, ?, ?, ?)`,
      [appointment.id, amount, "paystack", reference, "pending"]
    );

    // 🔥 initialize Paystack
    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: appointment.patient_email,
        amount: amount * 100,
        reference: reference,
        callback_url: `${process.env.BASE_URL}/payment-success`
      },
      {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
          }
      }
    );

    const paymentLink = paystackRes.data.data.authorization_url;

    // 🔥 update appointment
    await db.query(
      `UPDATE appointments 
       SET status='confirmed',
           consultation_fee=?,
           payment_link=?,
           confirmed_at=NOW()
       WHERE id=?`,
      [amount, paymentLink, appointment.id]
    );

    // 🔥 send email with payment link
    await sendPaymentEmail(
      appointment.patient_email,
      appointment.patient_name,
      paymentLink,
      amount
    );

    res.json({
      message: "Approved + Payment link sent ✅",
      payment_link: paymentLink
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// Reject appointment
// Reject appointment
router.put("/reject/:id", doctorAuth, async (req, res) => {
    try {
      const [doctorRows] = await db.query(
        "SELECT id FROM doctors WHERE user_id = ?",
        [req.user.id]
      );
  
      if (doctorRows.length === 0)
        return res.status(403).json({ error: "Doctor not found" });
  
      const doctorId = doctorRows[0].id;
  
      // ✅ Get appointment info
      const [appointments] = await db.query(
        `SELECT a.patient_email, a.patient_name, s.service_name
         FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE a.id = ?`,
        [req.params.id]
      );
  
      if (appointments.length === 0)
        return res.status(404).json({ error: "Appointment not found" });
  
      const appointment = appointments[0];
  
      // ✅ Update
      const [result] = await db.query(
        "UPDATE appointments SET status='cancelled' WHERE id=? AND doctor_id=?",
        [req.params.id, doctorId]
      );
  
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Appointment not found" });
  
      // ✅ Send email
      await sendAppointmentStatusEmail(
        appointment.patient_email,
        appointment.patient_name,
        appointment.service_name,
        "cancelled"
      );
  
      res.json({ message: "Appointment rejected + email sent ❌" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });router.get("/verify/:reference", async (req, res) => {
    const reference = req.params.reference;
  
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
  
    if (response.data.data.status === "success") {
  
      // ✅ update payments
      await db.query(
        "UPDATE payments SET payment_status='success' WHERE transaction_reference=?",
        [reference]
      );
  
      // ✅ get appointment details (for email)
      const [rows] = await db.query(
        `SELECT a.patient_email, a.patient_name, p.amount
         FROM payments p
         JOIN appointments a ON p.appointment_id = a.id
         WHERE p.transaction_reference=?`,
        [reference]
      );
  
      const user = rows[0];
  
      // ✅ update appointment
      await db.query(
        `UPDATE appointments 
         SET status='paid'
         WHERE id = (
           SELECT appointment_id FROM payments WHERE transaction_reference=?
         )`,
        [reference]
      );
  
      // 🔥 SEND EMAIL
      if (user) {
        await sendPaymentSuccessEmail(
          user.patient_email,
          user.patient_name,
          user.amount
        );
      }
  
      return res.send("Payment successful ✅");
    }
  
    res.send("Payment failed ❌");
  });
module.exports = router;




router.get("/approved", doctorAuth, async (req, res) => {
  try {
    // get doctor id
    const [doctorRows] = await db.query(
      "SELECT id FROM doctors WHERE user_id = ?",
      [req.user.id]
    );

    if (!doctorRows.length) {
      return res.status(403).json({ error: "Doctor not found" });
    }

    const doctorId = doctorRows[0].id;

    // 🔥 fetch ONLY approved + paid appointments
    const query = `
      SELECT 
        a.id,
        a.patient_name,
        a.patient_email,
        a.status,
        a.consultation_fee,
        a.slot_id,
        s.service_name,
        p.payment_status,
        p.amount
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      LEFT JOIN payments p ON p.appointment_id = a.id
      WHERE a.doctor_id = ?
        AND a.status = 'paid'
      ORDER BY a.id DESC
    `;

    const [results] = await db.query(query, [doctorId]);

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});