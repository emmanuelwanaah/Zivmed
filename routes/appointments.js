const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const sendBookingEmail = require("../utils/mailer"); // ✅ import mailer
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const authMiddleware = require("../middleware/authMiddleware");
// Middleware to check auth
// CREATE APPOINTMENT (All bookings go to one doctor)
router.post("/", async (req, res) => {
  try {
    const { patient_id, patient_name, patient_email, service_id } = req.body;

    if (!service_id || (!patient_id && !patient_email)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const defaultDoctorId = 21; // ID of your only doctor

    const [result] = await db.query(
      `INSERT INTO appointments 
           (patient_id, patient_name, patient_email, doctor_id, service_id, status)
           VALUES (?, ?, ?, ?, ?, 'pending')`,
      [patient_id || null, patient_name, patient_email, defaultDoctorId, service_id]
    );

    // ✅ Send email confirmation
    const subject = "Appointment Confirmation - Ziv Specialist Medical Centre";
    const html = `
      <h2>Hi ${patient_name},</h2>
      <p>Your appointment has been booked successfully!</p>
      <p><strong>Appointment Details:</strong></p>
      <ul>
        <li>Service ID: ${service_id}</li>
        <li>Doctor ID: ${defaultDoctorId}</li>
        <li>Status: Pending</li>
      </ul>
      <p>We will notify you once your appointment is approved.</p>
      <p>Thank you for choosing Ziv Specialist Medical Centre.</p>
    `;

    await sendBookingEmail(patient_email, subject, html);

    res.json({ message: "Appointment created and email sent ✅", appointment_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get appointments for logged-in patient// Get appointments for logged-in patient
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT 
        a.id, 
        a.status, 
        a.created_at, 
        a.patient_name, 
        a.patient_email, 
        s.service_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.patient_email = ?
      ORDER BY a.created_at ASC
      `,
      [req.user.email]
    );

const appointments = results.map(a => ({
  id: a.id,
  status: a.status,
  date: a.created_at,
  service_name: a.service_name,   // ✅ FIXED
  doctor_name: "Dr. John Smith",
  doctor_specialization: "--",
  patient_name: a.patient_name,
  patient_email: a.patient_email
}));

    // ✅ SEND ONE RESPONSE ONLY
    res.json({
      user: {
        full_name: req.user.full_name || "Patient",
        email: req.user.email,
      
      },
      appointments
    });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;