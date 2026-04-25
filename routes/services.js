const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all services
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, service_name FROM services");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

module.exports = router;