const nodemailer = require("nodemailer");

// ✅ ENV based config (SAFE)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// ✅ VERIFY CONNECTION
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ SMTP ERROR:", error.message);
  } else {
    console.log("✅ SMTP Server is ready");
  }
});


// ================= SEND OTP =================
const sendOTP = async (email, otp) => {
  try {

    const info = await transporter.sendMail({
      from: `"Auth System" <${process.env.EMAIL}>`, // ✅ same email
      to: email,
      subject: "OTP Verification",
      html: `
        <div style="font-family:sans-serif">
          <h2>Your OTP Code</h2>
          <h1 style="color:#6c63ff">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `
    });

    console.log("✅ OTP sent:", otp);
    console.log("📨 Message ID:", info.messageId);

  } catch (err) {
    console.log("❌ MAIL ERROR:", err.message);
    throw new Error("Email send failed");
  }
};

module.exports = sendOTP;