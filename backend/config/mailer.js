const nodemailer = require("nodemailer");

// ✅ PRODUCTION READY TRANSPORTER
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,        // 🔥 IMPORTANT
  secure: true,     // 🔥 MUST true for 465
  auth: {
   user: "ng23456789000@gmail.com",
pass: "hdnhaloddjfuqssv"
  }
});

// ✅ VERIFY CONNECTION (debug)
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
      from: `"Auth System" <${process.env.EMAIL}>`,
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