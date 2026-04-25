// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "frontend/assets")));
app.use("/css", express.static(path.join(__dirname, "frontend/css")));
app.use("/js", express.static(path.join(__dirname, "frontend/js")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/services", require("./routes/services"));

// Doctor API routes
app.use("/api/doctor/auth", require("./routes/doctorsauth"));
app.use("/api/doctor/appointments", require("./routes/doctorAppointments"));

// Frontend routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/index.html"))
);

app.get("/payment-success", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/payment-success.html"))
);

app.get("/payment-cancel", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/payment-cancel.html"))
);

// Doctor pages
app.get("/doctor/login", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/doctorLogin.html"))
);

app.get("/doctor/signup", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/doctorSignup.html"))
);

app.get("/doctor/dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/doctorDashboard.html"))
);

// Other pages
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/admin.html"))
);

app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/login.html"))
);

app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/register.html"))
);

app.get("/dashboard", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/dashboard.html"))
);

app.get("/booking", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/booking.html"))
);

app.get("/payment", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/payment.html"))
);

app.get("/reviews", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/review.html"))
);

app.get("/doctor/appointments/approved", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend/screens/approvedAppointments.html"))
);

// ✅ DB Connection Test
const db = require("./config/db");

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database Connected (Railway)");
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
  }
})();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));