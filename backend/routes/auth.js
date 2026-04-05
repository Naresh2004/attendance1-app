const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendOTP = require("../config/mailer");

const SECRET = "enterprise_secret";


// ================= SEND SIGNUP OTP =================
router.post("/send-signup-otp", async (req, res) => {
  try {

    console.log("🔥 Signup OTP API hit");

    const { email } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, msg: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    global.signupOTP = otp;
    global.signupEmail = email;
    global.signupExpire = Date.now() + 300000;

    console.log("📧 Sending Signup OTP:", otp);

    await sendOTP(email, otp);

    res.json({ success: true, msg: "OTP sent" });

  } catch (err) {
    console.log("❌ SIGNUP OTP ERROR:", err);
    res.json({ success: false, msg: "OTP failed" });
  }
});


// ================= VERIFY SIGNUP OTP =================
router.post("/verify-signup-otp", async (req, res) => {
  try {

    console.log("🔥 Verify Signup OTP API hit");

    const { email, password, otp } = req.body;

    if (email !== global.signupEmail) {
      return res.json({ success: false, msg: "Invalid email" });
    }

    if (otp !== global.signupOTP) {
      return res.json({ success: false, msg: "Invalid OTP" });
    }

    if (Date.now() > global.signupExpire) {
      return res.json({ success: false, msg: "OTP expired" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hash
    });

    await user.save();

    res.json({ success: true, msg: "Signup success" });

  } catch (err) {
    console.log("❌ VERIFY SIGNUP ERROR:", err);
    res.json({ success: false, msg: "Signup failed" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {

    console.log("🔥 Login API hit");

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, msg: "Wrong password" });

    const token = jwt.sign(
      { email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      msg: "Login success",
      token
    });

  } catch (err) {
    console.log("❌ LOGIN ERROR:", err);
    res.json({ success: false, msg: "Login failed" });
  }
});


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {

    console.log("🔥 Forgot Password API hit");

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 300000;
    user.isOtpVerified = false;

    await user.save();

    console.log("📧 Sending Forgot OTP:", otp);

    await sendOTP(email, otp);

    res.json({ success: true, msg: "OTP sent" });

  } catch (err) {
    console.log("❌ FORGOT ERROR:", err);
    res.json({ success: false, msg: "Failed to send OTP" });
  }
});


// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
  try {

    console.log("🔥 Verify OTP API hit");

    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    if (user.otp !== otp) {
      return res.json({ success: false, msg: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpire) {
      return res.json({ success: false, msg: "OTP expired" });
    }

    user.isOtpVerified = true;
    await user.save();

    res.json({ success: true, msg: "OTP verified" });

  } catch (err) {
    console.log("❌ VERIFY OTP ERROR:", err);
    res.json({ success: false, msg: "Verification failed" });
  }
});


// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
  try {

    console.log("🔥 Reset Password API hit");

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    if (!user.isOtpVerified) {
      return res.json({ success: false, msg: "OTP not verified" });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    user.otp = null;
    user.otpExpire = null;
    user.isOtpVerified = false;

    await user.save();

    res.json({ success: true, msg: "Password updated" });

  } catch (err) {
    console.log("❌ RESET ERROR:", err);
    res.json({ success: false, msg: "Reset failed" });
  }
});

module.exports = router;