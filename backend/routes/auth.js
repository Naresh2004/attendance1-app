const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendOTP = require("../config/mailer");

const SECRET = "enterprise_secret";


// ================= SEND OTP (SIGNUP) =================
router.post("/send-otp", async (req,res)=>{
try{

const {email}=req.body;

if(!email){
return res.json({success:false,msg:"Email required"});
}

// check existing user
const existing = await User.findOne({email});
if(existing){
return res.json({success:false,msg:"Email already registered"});
}

// generate otp
const otp=Math.floor(100000 + Math.random() * 900000).toString();

// store in global
global.otp=otp;
global.otpEmail=email;
global.otpExpire=Date.now()+300000;

// send email
await sendOTP(email,otp);

console.log("✅ SIGNUP OTP:", otp);

res.json({success:true,msg:"OTP sent successfully"});

}catch(err){
console.log("❌ SEND OTP ERROR:",err.message);
res.json({success:false,msg:"Email sending failed"});
}
});


// ================= REGISTER =================
router.post("/register", async (req,res)=>{
try{

const {email,password,otp}=req.body;

if(!email || !password || !otp){
return res.json({success:false,msg:"All fields required"});
}

if(email!==global.otpEmail){
return res.json({success:false,msg:"Invalid email"});
}

if(otp!==global.otp){
return res.json({success:false,msg:"Invalid OTP"});
}

if(Date.now()>global.otpExpire){
return res.json({success:false,msg:"OTP expired"});
}

// check again
const existing=await User.findOne({email});
if(existing){
return res.json({success:false,msg:"Email already registered"});
}

// hash password
const hash=await bcrypt.hash(password,10);

// save user
const user=new User({
email,
password:hash
});

await user.save();

// create token
const token = jwt.sign({ email }, SECRET, { expiresIn:"1h" });

res.json({success:true,msg:"Signup successful",token});

}catch(err){
console.log("❌ REGISTER ERROR:",err.message);
res.json({success:false,msg:"Signup failed"});
}
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
try {

const { email, password } = req.body;

if(!email || !password){
return res.json({ success:false, msg:"All fields required" });
}

const user = await User.findOne({ email });

if (!user){
return res.json({ success:false, msg: "User not found" });
}

const match = await bcrypt.compare(password, user.password);

if (!match){
return res.json({ success:false, msg: "Wrong password" });
}

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

} catch (err){
console.log("❌ LOGIN ERROR:",err.message);
res.json({ success:false, msg: "Login failed" });
}
});


// ================= FORGOT PASSWORD =================
router.post("/send-forgot-otp", async (req, res) => {
try {

const { email } = req.body;

if(!email){
return res.json({ success:false, msg:"Email required" });
}

const user = await User.findOne({ email });

if (!user){
return res.json({ success:false, msg: "User not found" });
}

const otp = Math.floor(100000 + Math.random() * 900000).toString();

user.otp = otp;
user.otpExpire = Date.now() + 300000;

await user.save();

// send mail
await sendOTP(email, otp);

console.log("✅ FORGOT OTP:", otp);

res.json({ success:true, msg: "OTP sent successfully" });

} catch (err){
console.log("❌ FORGOT OTP ERROR:",err.message);
res.json({ success:false, msg: "Email sending failed" });
}
});


// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
try {

const { email, otp } = req.body;

if(!email || !otp){
return res.json({ success:false, msg:"All fields required" });
}

const user = await User.findOne({ email });

if (!user){
return res.json({ success:false, msg: "User not found" });
}

if (user.otp !== otp){
return res.json({ success:false, msg: "Invalid OTP" });
}

if (Date.now() > user.otpExpire){
return res.json({ success:false, msg: "OTP expired" });
}

res.json({ success:true, msg:"OTP verified" });

} catch (err){
console.log("❌ VERIFY OTP ERROR:",err.message);
res.json({ success:false, msg:"Verification failed" });
}
});


// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
try {

const { email, password, otp } = req.body;

if(!email || !password || !otp){
return res.json({ success:false, msg:"All fields required" });
}

const user = await User.findOne({ email });

if (!user){
return res.json({ success:false, msg:"User not found" });
}

if (user.otp !== otp){
return res.json({ success:false, msg:"Invalid OTP" });
}

if (Date.now() > user.otpExpire){
return res.json({ success:false, msg:"OTP expired" });
}

const hash = await bcrypt.hash(password, 10);

user.password = hash;
user.otp = null;
user.otpExpire = null;

await user.save();

res.json({ success:true, msg:"Password updated successfully" });

} catch (err){
console.log("❌ RESET ERROR:",err.message);
res.json({ success:false, msg:"Reset failed" });
}
});

module.exports = router;