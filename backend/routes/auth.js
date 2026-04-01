const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendOTP = require("../config/mailer");

const SECRET = "enterprise_secret";


// ================= SEND OTP (COMMON) =================
router.post("/send-otp", async (req,res)=>{
try{

const {email}=req.body

if(!email){
return res.json({success:false,msg:"Email required"})
}

const otp=Math.floor(100000 + Math.random() * 900000).toString()

global.otp=otp
global.otpEmail=email
global.otpExpire=Date.now()+300000

await sendOTP(email,otp)

res.json({success:true,msg:"OTP sent"})

}catch(err){
console.log(err)
res.json({success:false,msg:"Failed to send OTP"})
}
})


// ================= REGISTER =================
router.post("/register", async (req,res)=>{
try{

const {email,password,otp}=req.body

if(!email || !password || !otp){
return res.json({success:false,msg:"All fields required"})
}

if(email!==global.otpEmail){
return res.json({success:false,msg:"Invalid email"})
}

if(otp!==global.otp){
return res.json({success:false,msg:"Invalid OTP"})
}

if(Date.now()>global.otpExpire){
return res.json({success:false,msg:"OTP expired"})
}

const existing=await User.findOne({email})
if(existing){
return res.json({success:false,msg:"Email already registered"})
}

const hash=await bcrypt.hash(password,10)

const user=new User({
email,
password:hash
})

await user.save()

const token = jwt.sign({ email }, SECRET, { expiresIn:"1h" })

res.json({success:true,msg:"Signup successful",token})

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
router.post("/send-forgot-otp", async (req, res) => {
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

res.json({ success:true, msg: "OTP sent" });

} catch (err){
console.log(err)
res.json({ success:false, msg: "Failed to send OTP" });
}
});


// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
try {

const { email, otp } = req.body;

const user = await User.findOne({ email });

if (!user) return res.json({ success:false, msg: "User not found" });

if (user.otp !== otp){
return res.json({ success:false, msg: "Invalid OTP" });
}

if (Date.now() > user.otpExpire){
return res.json({ success:false, msg: "OTP expired" });
}

res.json({ success:true });

} catch (err){
console.log(err)
res.json({ success:false });
}
});


// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
try {

const { email, password, otp } = req.body;

const user = await User.findOne({ email });

if (!user) return res.json({ success:false });

if (user.otp !== otp){
return res.json({ success:false, msg:"Invalid OTP" });
}

const hash = await bcrypt.hash(password, 10);

user.password = hash;
user.otp = null;
user.otpExpire = null;

await user.save();

res.json({ success:true });

} catch (err){
console.log(err)
res.json({ success:false });
}
});

module.exports = router;