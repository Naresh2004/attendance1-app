// import React,{useState,useEffect} from "react"
// import axios from "axios"
// import "../Auth.css"

// // ✅ FIXED BASE URL
// const API = "https://attendance-backend-lghd.onrender.com/api/auth"

// export default function Register({setPage}){

// const [email,setEmail]=useState("")
// const [password,setPassword]=useState("")
// const [otp,setOtp]=useState("")
// const [show,setShow]=useState(false)
// const [loading,setLoading]=useState(false)
// const [step,setStep]=useState(1)

// // MESSAGE STATE
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

// if(!email || !password){
// setMsg("Enter email and password first")
// setMsgType("error")
// return
// }

// try{

// setLoading(true)

// const res=await axios.post(
// `${API}/send-otp`,   // ✅ FIXED
// {email}
// )

// if(res.data.success){
// setMsg("OTP sent successfully")
// setMsgType("success")
// setStep(2)
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

// // ================= VERIFY OTP =================
// const verifyOTP=async()=>{

// if(!otp){
// setMsg("Enter OTP")
// setMsgType("error")
// return
// }

// try{

// setLoading(true)

// const res=await axios.post(
// `${API}/register`,   // ✅ FIXED
// {email,password,otp}
// )

// if(res.data.success){

// setMsg("Account Created Successfully")
// setMsgType("success")

// // OPTIONAL TOKEN
// if(res.data.token){
// localStorage.setItem("token", res.data.token)
// }

// // DIRECT DASHBOARD
// setTimeout(()=>{
// setPage("dashboard")
// },1500)

// }else{

// setMsg(res.data.msg || "Invalid OTP")
// setMsgType("error")

// }

// }catch{

// setMsg("Signup failed")
// setMsgType("error")

// }

// setLoading(false)
// }

// // ================= UI =================
// return(

// <div className="auth-container">

// <div className="auth-card">

// <h2>Create Account</h2>

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

// <div className="password-box">

// <input
// type={show ? "text":"password"}
// placeholder="Enter Password"
// value={password}
// onChange={(e)=>setPassword(e.target.value)}
// />

// <span onClick={()=>setShow(!show)}>
// {show ? "Hide":"Show"}
// </span>

// </div>

// {/* STEP 1 */}
// {step===1 &&

// <button onClick={sendOTP}>
// {loading ? "Sending OTP..." : "Send OTP"}
// </button>

// }

// {/* STEP 2 */}
// {step===2 &&

// <>

// <input
// placeholder="Enter OTP"
// value={otp}
// onChange={(e)=>setOtp(e.target.value)}
// />

// <button onClick={verifyOTP}>
// {loading ? "Verifying..." : "Verify & Signup"}
// </button>

// </>

// }

// <p className="link" onClick={()=>setPage("login")}>
// Already have an account? Login
// </p>

// </div>

// </div>

// )

// }

import React,{useState,useEffect} from "react"
import axios from "axios"
import "../Auth.css"

// ✅ सही API (auth हटाया)
const API = "https://attendance-backend-lghd.onrender.com/api"

export default function Register({setPage}){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [otp,setOtp]=useState("")
const [show,setShow]=useState(false)
const [loading,setLoading]=useState(false)
const [step,setStep]=useState(1)

const [msg,setMsg]=useState("")
const [msgType,setMsgType]=useState("")

// AUTO HIDE
useEffect(()=>{
if(msg){
const t=setTimeout(()=>setMsg(""),3000)
return ()=>clearTimeout(t)
}
},[msg])

// ================= SEND OTP =================
const sendOTP=async()=>{

if(!email || !password){
setMsg("Enter email and password first")
setMsgType("error")
return
}

try{

setLoading(true)

// ✅ FIXED API
const res=await axios.post(`${API}/send-signup-otp`,{
  email: email.trim()
})

console.log("SEND OTP RESPONSE:",res.data)

if(res.data.success){
setMsg("OTP Sent ✅ (Check email/spam)")
setMsgType("success")
setStep(2)
}else{
setMsg(res.data.msg || "OTP failed")
setMsgType("error")
}

}catch(error){

console.log("OTP ERROR:",error.response?.data || error.message)

setMsg(
error.response?.data?.msg ||
"Server error / Email config issue"
)
setMsgType("error")

}

setLoading(false)
}

// ================= VERIFY OTP =================
const verifyOTP=async()=>{

if(!otp){
setMsg("Enter OTP")
setMsgType("error")
return
}

try{

setLoading(true)

// ✅ FIXED API
const res=await axios.post(`${API}/verify-signup-otp`,{
email,
password,
otp
})

console.log("VERIFY RESPONSE:",res.data)

if(res.data.success){

setMsg("Account Created Successfully ✅")
setMsgType("success")

if(res.data.token){
localStorage.setItem("token",res.data.token)
}

// redirect
setTimeout(()=>{
setPage("dashboard")
},1000)

}else{
setMsg(res.data.msg || "Invalid OTP")
setMsgType("error")
}

}catch(error){

console.log("VERIFY ERROR:",error.response?.data || error.message)

setMsg(
error.response?.data?.msg ||
"Signup failed (check backend)"
)
setMsgType("error")

}

setLoading(false)
}

// ================= UI =================
return(

<div className="auth-container">

<div className="auth-card">

<h2>Create Account</h2>

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

<div className="password-box">

<input
type={show ? "text":"password"}
placeholder="Enter Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<span onClick={()=>setShow(!show)}>
{show ? "Hide":"Show"}
</span>

</div>

{/* STEP 1 */}
{step===1 && (
<button onClick={sendOTP} disabled={loading}>
{loading ? "Sending OTP..." : "Send OTP"}
</button>
)}

{/* STEP 2 */}
{step===2 && (
<>
<input
placeholder="Enter OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
/>

<button onClick={verifyOTP} disabled={loading}>
{loading ? "Verifying..." : "Verify & Signup"}
</button>
</>
)}

<p className="link" onClick={()=>setPage("login")}>
Already have an account? Login
</p>

</div>

</div>

)
}