const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPaymentEmail(email, name, link, amount) {
  try {
    await resend.emails.send({
      from: "Ziv Specialist Medical Consult <onboarding@resend.dev>",
      to: email,
      subject: "Appointment Approved – Complete Your Payment 💳",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px;">
            
            <h2 style="color: #2c3e50; text-align: center;">
              Appointment Approved
            </h2>

            <p style="font-size: 16px; color: #333;">
              Hello <strong>${name}</strong>,
            </p>

            <p style="font-size: 15px; color: #555;">
              Your appointment has been <strong>approved</strong> by the doctor.
              To confirm your booking, please complete your payment.
            </p>

            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Amount Due:</strong> ₵${amount}</p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${link}" target="_blank"
                style="
                  background-color: #2563eb;
                  color: #ffffff;
                  padding: 12px 20px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
                  display: inline-block;
                ">
                Pay Now
              </a>
            </div>

            <p style="font-size: 14px; color: #555;">
              Please complete your payment promptly to secure your appointment.
            </p>

            <hr style="margin: 25px 0;">

            <p style="font-size: 13px; color: #999; text-align: center;">
              Ziv Specialist Medical Consult 💙
            </p>

          </div>
        </div>
      `,
    });

    console.log("✅ Payment email sent to:", email);
  } catch (err) {
    console.error("❌ Payment email failed:", err);
  }
}

module.exports = sendPaymentEmail;