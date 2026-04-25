const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendAppointmentStatusEmail(to, patientName, serviceName, status) {
  const subject =
    status === "confirmed"
      ? "Appointment Confirmed "
      : "Appointment Cancelled ";

  const message =
    status === "confirmed"
      ? "Your appointment has been confirmed by the doctor."
      : "Your appointment has been cancelled by the doctor.";

  const mailOptions = {
    from: `"Ziv Specialist Medical Centre" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <h3>Hello ${patientName},</h3>
      <p>${message}</p>
      <p><b>Service:</b> ${serviceName}</p>
      <p>Status: <b>${status.toUpperCase()}</b></p>
      <br/>
      <p>Thank you for choosing Ziv Specialist Medical Consult.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Status email sent to:", to);
  } catch (err) {
    console.error("Email error:", err);
  }
}

module.exports = sendAppointmentStatusEmail;