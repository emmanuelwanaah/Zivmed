// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendBookingEmail(to, patientName, serviceName, date, time) {
  const mailOptions = {
    from: `"Ziv Specialist Medical Consult" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Appointment Booking Confirmation ✅",
    html: `
      <h3>Hello ${patientName},</h3>
      <p>Your appointment has been successfully booked.</p>
      <ul>
        <li><b>Service:</b> ${serviceName}</li>
        <li><b>Date:</b> ${date}</li>
        <li><b>Time:</b> ${time}</li>
      </ul>
      <p>Thank you for choosing Ziv Specialist Medical Centre!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to:", to);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = sendBookingEmail;