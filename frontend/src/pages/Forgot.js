// import React,{useState,useEffect} from "react"
// import axios from "axios"
// import { useNavigate } from "react-router-dom"
// import "../Auth.css"

// export default function Forgot(){

// const navigate = useNavigate()

// const [email,setEmail]=useState("")
// const [otp,setOtp]=useState(["","","","","",""])
// const [password,setPassword]=useState("")
// const [loading,setLoading]=useState(false)
// const [timer,setTimer]=useState(0)

// // MESSAGE
// const [msg,setMsg]=useState("")
// const [msgType,setMsgType]=useState("")

// // AUTO HIDE MESSAGE
// useEffect(()=>{
// if(msg){
// const t=setTimeout(()=>setMsg(""),2000)
// return ()=>clearTimeout(t)
// }
// },[msg])

// // ================= SEND OTP =================
// const sendOTP=async()=>{

// if(!email){
// setMsg("Enter email first")
// setMsgType("error")
// return
// }

// try{
// setLoading(true)

// const res = await axios.post(
// "http://localhost:5000/api/forgot-password",
// {email}
// )

// if(res.data.success){
// setMsg("OTP Sent Successfully")
// setMsgType("success")
// setTimer(30)
// setOtp(["","","","","",""])
// }else{
// setMsg(res.data.msg)
// setMsgType("error")
// }

// }catch{
// setMsg("OTP send failed")
// setMsgType("error")
// }

// setLoading(false)
// }

// // ================= TIMER =================
// useEffect(()=>{
// if(timer===0) return

// const interval=setInterval(()=>{
// setTimer(prev=>prev-1)
// },1000)

// return ()=>clearInterval(interval)

// },[timer])

// // ================= VERIFY OTP =================
// const verifyOTP=async()=>{

// const otpValue=otp.join("")

// if(otpValue.length!==6){
// setMsg("Enter full OTP")
// setMsgType("error")
// return
// }

// try{

// const res=await axios.post(
// "http://localhost:5000/api/verify-otp",
// {email,otp:otpValue}
// )

// if(res.data.success){
// setMsg("OTP Verified Successfully")
// setMsgType("success")
// }else{
// setMsg(res.data.msg || "Invalid OTP")
// setMsgType("error")
// }

// }catch{
// setMsg("OTP verification failed")
// setMsgType("error")
// }
// }

// // ================= RESET PASSWORD =================
// const reset=async()=>{

// const otpValue = otp.join("")

// if(otpValue.length!==6){
// setMsg("Enter OTP first")
// setMsgType("error")
// return
// }

// if(!password){
// setMsg("Enter new password")
// setMsgType("error")
// return
// }

// try{

// const res=await axios.post(
// "http://localhost:5000/api/reset-password",
// {
//   email,
//   password,
//   otp: otpValue
// }
// )

// if(res.data.success){

// setMsg("Password Reset Successful")
// setMsgType("success")

// setOtp(["","","","","",""])
// setPassword("")

// // AUTO REDIRECT
// setTimeout(()=>{
//   navigate("/login")
// },1500)

// }else{
// setMsg(res.data.msg || "Reset failed")
// setMsgType("error")
// }

// }catch{
// setMsg("Server error")
// setMsgType("error")
// }
// }

// // ================= OTP INPUT =================
// const handleOtpChange=(value,index)=>{

// if(!/^[0-9]?$/.test(value)) return

// const newOtp=[...otp]
// newOtp[index]=value
// setOtp(newOtp)

// if(value && index<5){
// document.getElementById(`otp-${index+1}`).focus()
// }
// }

// // ================= BACKSPACE =================
// const handleKeyDown=(e,index)=>{
// if(e.key==="Backspace" && !otp[index] && index>0){
// document.getElementById(`otp-${index-1}`).focus()
// }
// }

// // ================= UI =================
// return(

// <div className="auth-container">

// <div className="auth-card">

// <h2>🔐 Forgot Password</h2>

// {/* MESSAGE */}
// {msg && (
// <p className={`msg ${msgType}`}>
// {msg}
// </p>
// )}

// <input
// type="email"
// placeholder="Enter Email"
// value={email}
// onChange={(e)=>setEmail(e.target.value)}
// />

// <button onClick={sendOTP}>
// {loading ? "Sending..." : "Send OTP"}
// </button>

// <p className="loader">OTP valid for 5 minutes</p>

// {/* OTP BOX */}
// <div className="otp-container">
// {otp.map((digit,index)=>(
// <input
// key={index}
// id={`otp-${index}`}
// className="otp-box"
// value={digit}
// onChange={(e)=>handleOtpChange(e.target.value,index)}
// onKeyDown={(e)=>handleKeyDown(e,index)}
// maxLength="1"
// />
// ))}
// </div>

// <button onClick={verifyOTP}>
// Verify OTP
// </button>

// {/* TIMER */}
// {timer>0 ? (
// <p className="loader">
// Resend OTP in {timer}s
// </p>
// ) : (
// <p className="resend" onClick={sendOTP}>
// Resend OTP
// </p>
// )}

// <input
// type="password"
// placeholder="New Password"
// value={password}
// onChange={(e)=>setPassword(e.target.value)}
// />

// <button onClick={reset}>
// Reset Password
// </button>

// {/* LOGIN BUTTON */}
// <button 
// className="login-btn"
// onClick={()=>navigate("/login")}
// >
// Go to Login
// </button>

// </div>

// </div>

// )
// }
import React,{useState,useEffect} from "react"
import axios from "axios"
import "../Auth.css"

// ✅ FIXED API BASE URL
const API = "https://attendance-backend-lghd.onrender.com/api/auth"

export default function Forgot({ setPage }){

const [email,setEmail]=useState("")
const [otp,setOtp]=useState(["","","","","",""])
const [password,setPassword]=useState("")
const [loading,setLoading]=useState(false)
const [timer,setTimer]=useState(0)

// MESSAGE
const [msg,setMsg]=useState("")
const [msgType,setMsgType]=useState("")

// AUTO HIDE MESSAGE
useEffect(()=>{
if(msg){
const t=setTimeout(()=>setMsg(""),2000)
return ()=>clearTimeout(t)
}
},[msg])

// ================= SEND OTP =================
const sendOTP=async()=>{

if(!email){
setMsg("Enter email first")
setMsgType("error")
return
}

try{
setLoading(true)

const res = await axios.post(
`${API}/send-otp`,   // ✅ FIXED
{email}
)

if(res.data.success){
setMsg("OTP Sent Successfully")
setMsgType("success")
setTimer(30)
setOtp(["","","","","",""])
}else{
setMsg(res.data.msg)
setMsgType("error")
}

}catch{
setMsg("OTP send failed")
setMsgType("error")
}

setLoading(false)
}

// ================= TIMER =================
useEffect(()=>{
if(timer===0) return

const interval=setInterval(()=>{
setTimer(prev=>prev-1)
},1000)

return ()=>clearInterval(interval)

},[timer])

// ================= VERIFY OTP =================
const verifyOTP=async()=>{

const otpValue=otp.join("")

if(otpValue.length!==6){
setMsg("Enter full OTP")
setMsgType("error")
return
}

try{

const res=await axios.post(
`${API}/verify-otp`,   // ✅ FIXED
{email,otp:otpValue}
)

if(res.data.success){
setMsg("OTP Verified Successfully")
setMsgType("success")
}else{
setMsg(res.data.msg || "Invalid OTP")
setMsgType("error")
}

}catch{
setMsg("OTP verification failed")
setMsgType("error")
}
}

// ================= RESET PASSWORD =================
const reset=async()=>{

const otpValue = otp.join("")

if(otpValue.length!==6){
setMsg("Enter OTP first")
setMsgType("error")
return
}

if(!password){
setMsg("Enter new password")
setMsgType("error")
return
}

try{

const res=await axios.post(
`${API}/reset-password`,   // ✅ FIXED
{
  email,
  password,
  otp: otpValue
}
)

if(res.data.success){

setMsg("Password Reset Successful")
setMsgType("success")

setOtp(["","","","","",""])
setPassword("")

setTimeout(()=>{
  setPage("login")
},1500)

}else{
setMsg(res.data.msg || "Reset failed")
setMsgType("error")
}

}catch{
setMsg("Server error")
setMsgType("error")
}
}

// ================= OTP INPUT =================
const handleOtpChange=(value,index)=>{
if(!/^[0-9]?$/.test(value)) return

const newOtp=[...otp]
newOtp[index]=value
setOtp(newOtp)

if(value && index<5){
document.getElementById(`otp-${index+1}`).focus()
}
}

// ================= BACKSPACE =================
const handleKeyDown=(e,index)=>{
if(e.key==="Backspace" && !otp[index] && index>0){
document.getElementById(`otp-${index-1}`).focus()
}
}

// ================= UI =================
return(

<div className="auth-container">

<div className="auth-card">

<h2>🔐 Forgot Password</h2>

{msg && (
<p className={`msg ${msgType}`}>
{msg}
</p>
)}

<input
type="email"
placeholder="Enter Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<button onClick={sendOTP}>
{loading ? "Sending..." : "Send OTP"}
</button>

<p className="loader">OTP valid for 5 minutes</p>

<div className="otp-container">
{otp.map((digit,index)=>(
<input
key={index}
id={`otp-${index}`}
className="otp-box"
value={digit}
onChange={(e)=>handleOtpChange(e.target.value,index)}
onKeyDown={(e)=>handleKeyDown(e,index)}
maxLength="1"
/>
))}
</div>

<button onClick={verifyOTP}>
Verify OTP
</button>

{timer>0 ? (
<p className="loader">
Resend OTP in {timer}s
</p>
) : (
<p className="resend" onClick={sendOTP}>
Resend OTP
</p>
)}

<input
type="password"
placeholder="New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={reset}>
Reset Password
</button>

<button 
className="login-btn"
onClick={()=>setPage("login")}
>
Go to Login
</button>

</div>

</div>

)
}