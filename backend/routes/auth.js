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

if(!email){
return res.json({success:false,msg:"Email required"})
}

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

}catch(err){
console.log(err)
res.json({success:false,msg:"Failed to send OTP"})
}
})


// ================= VERIFY SIGNUP OTP =================
router.post("/verify-signup-otp", async (req,res)=>{
try{

const {email,password,otp}=req.body

if(!email || !password || !otp){
return res.json({success:false,msg:"All fields required"})
}

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
password:hash
})

await user.save()

res.json({success:true,msg:"Signup successful"})

}catch(err){
console.log(err)
res.json({success:false,msg:"Signup failed"})
}
})


// ================= LOGIN =================
router.post("/login", async (req, res) => {
try {

const { email, password } = req.body;

if(!email || !password){
return res.json({ success:false, msg:"All fields required" })
}

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

} catch (err){
console.log(err)
res.json({ success:false, msg: "Login failed" });
}
});


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
try {

const { email } = req.body;

if(!email){
return res.json({ success:false, msg:"Email required" })
}

const user = await User.findOne({ email });

if (!user) return res.json({ success:false, msg: "User not found" });

const otp = Math.floor(100000 + Math.random() * 900000).toString();

user.otp = otp;
user.otpExpire = Date.now() + 300000;

await user.save();

await sendOTP(email, otp);

console.log("OTP SENT:", otp); // 🔥 debug

res.json({ success:true, msg: "OTP sent to email" });

} catch (err){
console.log(err)
res.json({ success:false, msg: "Failed to send OTP" });
}
});


// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
try {

const { email, otp } = req.body;

if(!email || !otp){
return res.json({ success:false, msg:"All fields required" })
}

const user = await User.findOne({ email });

if (!user) return res.json({ success:false, msg: "User not found" });

console.log("DB OTP:", user.otp);
console.log("USER OTP:", otp);

if (user.otp !== otp){
return res.json({ success:false, msg: "Invalid OTP" });
}

if (Date.now() > user.otpExpire){
return res.json({ success:false, msg: "OTP expired" });
}

res.json({ success:true, msg: "OTP verified" });

} catch (err){
console.log(err)
res.json({ success:false, msg: "OTP verification failed" });
}
});


// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
try {

const { email, password, otp } = req.body;

if(!email || !password || !otp){
return res.json({ success:false, msg:"All fields required" })
}

const user = await User.findOne({ email });

if (!user) return res.json({ success:false, msg: "User not found" });

console.log("RESET DB OTP:", user.otp);
console.log("RESET USER OTP:", otp);

// ✅ FINAL CHECK
if (user.otp !== otp) {
return res.json({ success:false, msg: "Invalid OTP" });
}

if (Date.now() > user.otpExpire) {
return res.json({ success:false, msg: "OTP expired" });
}

const hash = await bcrypt.hash(password, 10);

user.password = hash;

// cleanup
user.otp = null;
user.otpExpire = null;

await user.save();

res.json({ success:true, msg: "Password updated successfully" });

} catch (err){
console.log(err)
res.json({ success:false, msg: "Password reset failed" });
}
});


module.exports = router;