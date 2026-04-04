const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendOTP = require("../config/mailer");

const SECRET = "enterprise_secret";


// ================= SEND SIGNUP OTP =================
router.post("/send-signup-otp", async (req,res)=>{
try{

const {email}=req.body

const existing=await User.findOne({email})

if(existing){
return res.json({success:false,msg:"Email already registered"})
}

const otp=Math.floor(100000 + Math.random() * 900000).toString()

global.signupOTP=otp
global.signupEmail=email
global.signupExpire=Date.now()+300000

await sendOTP(email,otp)

res.json({success:true,msg:"OTP sent to email"})

}catch{
res.json({success:false,msg:"Failed to send OTP"})
}
})


// ================= VERIFY SIGNUP OTP =================
router.post("/verify-signup-otp", async (req,res)=>{
try{

const {email,password,otp}=req.body

if(email!==global.signupEmail){
return res.json({success:false,msg:"Invalid email"})
}

if(otp!==global.signupOTP){
return res.json({success:false,msg:"Invalid OTP"})
}

if(Date.now()>global.signupExpire){
return res.json({success:false,msg:"OTP expired"})
}

const hash=await bcrypt.hash(password,10)

const user=new User({
email,
password:hash,
isOtpVerified:false   // 🔥 ADD
})

await user.save()

res.json({success:true,msg:"Signup successful"})

}catch{
res.json({success:false,msg:"Signup failed"})
}
})


// ================= LOGIN =================
router.post("/login", async (req, res) => {
try {

const { email, password } = req.body;

const user = await User.findOne({ email });

if (!user) return res.json({ success:false, msg: "User not found" });

const match = await bcrypt.compare(password, user.password);

if (!match) return res.json({ success:false, msg: "Wrong password" });

const token = jwt.sign(
{ email: user.email },
SECRET,
{ expiresIn: "1h" }
);

res.json({
success:true,
msg: "Login success",
token
});

} catch {
res.json({ success:false, msg: "Login failed" });
}
});


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
try {

const { email } = req.body;

const user = await User.findOne({ email });

if (!user) return res.json({ success:false, msg: "User not found" });

const otp = Math.floor(100000 + Math.random() * 900000).toString();

user.otp = otp;
user.otpExpire = Date.now() + 300000;

// 🔥 FIX (old users ke liye bhi)
user.isOtpVerified = false;

await user.save();

await sendOTP(email, otp);

res.json({ success:true, msg: "OTP sent to email" });

} catch {
res.json({ success:false, msg: "Failed to send OTP" });
}
});


// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
try {

const { email, otp } = req.body;

const user = await User.findOne({ email });

if (!user) return res.json({ success:false, msg: "User not found" });

if (user.otp !== otp)
return res.json({ success:false, msg: "Invalid OTP" });

if (Date.now() > user.otpExpire)
return res.json({ success:false, msg: "OTP expired" });

// 🔥 FIX (force update)
user.isOtpVerified = true;
await user.save();

res.json({ success:true, msg: "OTP verified" });

} catch {
res.json({ success:false, msg: "OTP verification failed" });
}
});


// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
try {

const { email, password } = req.body;

const user = await User.findOne({ email });

if (!user) return res.json({ success:false, msg: "User not found" });

// 🔥 MAIN FIX
if (!user.isOtpVerified) {
return res.json({ success:false, msg: "OTP not verified" });
}

const hash = await bcrypt.hash(password, 10);

user.password = hash;

// 🔥 RESET EVERYTHING
user.otp = null;
user.otpExpire = null;
user.isOtpVerified = false;

await user.save();

res.json({ success:true, msg: "Password updated successfully" });

} catch {
res.json({ success:false, msg: "Password reset failed" });
}
});

module.exports = router;