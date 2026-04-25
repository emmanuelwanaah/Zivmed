const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPaymentSuccessEmail(email, name, amount) {
  try {
    await resend.emails.send({
      from: "Ziv Specialist Medical Consult <onboarding@resend.dev>",
      to: email,
      subject: "Payment Successful – Appointment Confirmed ✅",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px;">
            
            <h2 style="color: #16a34a; text-align: center;">
              Payment Successful 🎉
            </h2>

            <p style="font-size: 16px; color: #333;">
              Hello <strong>${name}</strong>,
            </p>

            <p style="font-size: 15px; color: #555;">
              Your payment has been successfully processed and your appointment is now <strong>fully confirmed</strong>.
            </p>

            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Amount Paid:</strong> ₵${amount}</p>
            </div>

            <p style="font-size: 15px; color: #555;">
              We look forward to seeing you at your scheduled appointment.
            </p>

            <p style="font-size: 14px; color: #555;">
              If you have any questions or need assistance, feel free to contact us anytime.
            </p>

            <hr style="margin: 25px 0;">

            <p style="font-size: 13px; color: #999; text-align: center;">
              Thank you for choosing <strong>Ziv Specialist Medical Consult</strong> 💙
            </p>

          </div>
        </div>
      `,
    });

    console.log("✅ Payment success email sent to:", email);
  } catch (err) {
    console.error("❌ Payment success email failed:", err);
  }
}

module.exports = sendPaymentSuccessEmail;