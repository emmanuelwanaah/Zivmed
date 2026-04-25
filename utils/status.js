const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendAppointmentStatusEmail(to, patientName, serviceName, status) {
  const isConfirmed = status === "confirmed";

  const subject = isConfirmed
    ? "Appointment Confirmed ✅"
    : "Appointment Cancelled ❌";

  const message = isConfirmed
    ? "Your appointment has been successfully confirmed by the doctor."
    : "Unfortunately, your appointment has been cancelled by the doctor.";

  const color = isConfirmed ? "#16a34a" : "#dc2626";
  const bgColor = isConfirmed ? "#ecfdf5" : "#fef2f2";

  try {
    await resend.emails.send({
      from: "Ziv Specialist Medical Consult <onboarding@resend.dev>",
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px;">
            
            <h2 style="color: ${color}; text-align: center;">
              ${isConfirmed ? "Appointment Confirmed" : "Appointment Cancelled"}
            </h2>

            <p style="font-size: 16px; color: #333;">
              Hello <strong>${patientName}</strong>,
            </p>

            <p style="font-size: 15px; color: #555;">
              ${message}
            </p>

            <div style="background: ${bgColor}; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> ${serviceName}</p>
              <p><strong>Status:</strong> ${status.toUpperCase()}</p>
            </div>

            ${
              isConfirmed
                ? `<p style="font-size: 14px; color: #555;">
                    Please ensure you arrive on time for your appointment.
                   </p>`
                : `<p style="font-size: 14px; color: #555;">
                    You may reschedule another appointment at your convenience.
                   </p>`
            }

            <hr style="margin: 25px 0;">

            <p style="font-size: 13px; color: #999; text-align: center;">
              Ziv Specialist Medical Consult 💙
            </p>

          </div>
        </div>
      `,
    });

    console.log("✅ Status email sent to:", to);
  } catch (err) {
    console.error("❌ Status email failed:", err);
  }
}

module.exports = sendAppointmentStatusEmail;