require("dotenv").config(); // 🔥 IMPORTANT

const nodemailer = require("nodemailer");

// ================= DEBUG =================
console.log("MAIL USER:", process.env.EMAIL);
console.log("MAIL PASS:", process.env.PASS ? "Loaded" : "Not Loaded");

// ================= TRANSPORT =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// ================= VERIFY =================
transporter.verify((error, success) => {
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