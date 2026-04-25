const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all doctors (optionally by service)
router.get("/", async (req, res) => {
  const { service_id } = req.query;
  try {
    let query = `
      SELECT d.id, u.full_name AS doctor_name, s.service_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN services s ON s.id = d.service_id
    `;
    if(service_id){
      query += " WHERE s.id = ?";
      const [rows] = await db.query(query, [service_id]);
      return res.json(rows);
    }
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Get available dates for a doctor
router.get("/dates/:doctor_id", async (req, res) => {
  const doctorId = req.params.doctor_id;
  try {
    const [rows] = await db.query(
      "SELECT available_date FROM doctor_available_dates WHERE doctor_id = ? ORDER BY available_date ASC",
      [doctorId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Get available time slots for doctor on a date
// routes/doctors.js
router.get("/slots/:doctor_id/:date", async (req, res) => {
  const { doctor_id, date } = req.params;

  // Define static time slots
  const timeSlots = [
    { id: 1, start_time: "09:00:00", end_time: "09:30:00" },
    { id: 2, start_time: "09:30:00", end_time: "10:00:00" },
    { id: 3, start_time: "10:00:00", end_time: "10:30:00" },
    { id: 4, start_time: "10:30:00", end_time: "11:00:00" },
    { id: 5, start_time: "11:00:00", end_time: "11:30:00" },
    { id: 6, start_time: "11:30:00", end_time: "12:00:00" },
  ];

  res.json(timeSlots);
});
module.exports = router;