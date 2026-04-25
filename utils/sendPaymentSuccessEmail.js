const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

async function sendPaymentSuccessEmail(email, name, amount) {
  await transporter.sendMail({
    from: "zivmedical consult",
    to: email,
    subject: "Payment Successful ✅",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your payment was successful.</p>
      <p><strong>Amount Paid:</strong> ₵${amount}</p>
      <p>Your appointment is now confirmed.</p>
      <p>Thank you!</p>
    `
  });
}

module.exports = sendPaymentSuccessEmail;