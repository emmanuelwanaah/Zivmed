const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBookingEmail(to, patientName, serviceName, date, time) {
  try {
    await resend.emails.send({
      from: "Ziv Specialist Medical Consult <onboarding@resend.dev>",
      to,
      subject: "Appointment Confirmation - Ziv Medical ✅",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px;">
            
            <h2 style="color: #2c3e50; text-align: center;">
              Appointment Confirmed
            </h2>

            <p style="font-size: 16px; color: #333;">
              Hello <strong>${patientName}</strong>,
            </p>

            <p style="font-size: 15px; color: #555;">
              Your appointment has been successfully booked with 
              <strong>Ziv Specialist Medical Centre</strong>.
            </p>

            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> ${serviceName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
            </div>

            <p style="font-size: 15px; color: #555;">
              Please arrive at least <strong>10 minutes early</strong> for your appointment.
            </p>

            <p style="font-size: 15px; color: #555;">
              If you need to make any changes, feel free to contact us.
            </p>

            <hr style="margin: 25px 0;">

            <p style="font-size: 13px; color: #999; text-align: center;">
              Thank you for choosing <strong>Ziv Specialist Medical Consult</strong> 💙
            </p>

          </div>
        </div>
      `,
    });

    console.log("✅ Booking email sent to:", to);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
}

module.exports = sendBookingEmail;