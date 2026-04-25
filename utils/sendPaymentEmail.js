const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

async function sendPaymentEmail(email, name, link, amount) {
  await transporter.sendMail({
    from: "Clinic",
    to: email,
    subject: "Appointment Approved - Payment Required",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your appointment has been approved.</p>
      <p><strong>Amount: ₵${amount}</strong></p>
      <p>Click below to pay:</p>
      <a href="${link}" target="_blank">Pay Now</a>
    `
  });
}

module.exports = sendPaymentEmail;