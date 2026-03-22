// import React,{useState} from "react"
// import axios from "axios"
// import "../Auth.css"

// export default function Login(){

// const [email,setEmail]=useState("")
// const [password,setPassword]=useState("")
// const [show,setShow]=useState(false)
// const [loading,setLoading]=useState(false)

// const login=async()=>{

// try{

// setLoading(true)

// const res=await axios.post(
// "http://localhost:5000/api/login",
// {email,password}
// )

// if(res.data.token){
// localStorage.setItem("token",res.data.token)
// }

// alert(res.data.msg)

// }catch(err){

// alert("Login failed")

// }

// setLoading(false)

// }

// return(

// <div className="auth-container">

// <div className="auth-card">

// <h2>Enterprise Login</h2>

// <input
// type="email"
// placeholder="Enter Email"
// onChange={(e)=>setEmail(e.target.value)}
// />

// <div className="password-box">

// <input
// type={show ? "text":"password"}
// placeholder="Enter Password"
// onChange={(e)=>setPassword(e.target.value)}
// />

// <span onClick={()=>setShow(!show)}>

// {show ? "Hide":"Show"}

// </span>

// </div>

// <button onClick={login}>

// {loading ? "Logging in..." : "Login"}

// </button>

// <p className="link">Forgot Password?</p>

// </div>

// </div>

// )

// }
import React,{useState,useEffect} from "react"
import axios from "axios"
import "../Auth.css"

export default function Login({setPage}){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [show,setShow]=useState(false)
const [loading,setLoading]=useState(false)

// MESSAGE STATE
const [msg,setMsg]=useState("")
const [msgType,setMsgType]=useState("")

// AUTO HIDE MESSAGE
useEffect(()=>{
if(msg){
const timer=setTimeout(()=>{
setMsg("")
},2000)
return ()=>clearTimeout(timer)
}
},[msg])

// ================= LOGIN =================
const login=async()=>{

if(!email || !password){
setMsg("Please enter email and password")
setMsgType("error")
return
}

try{

setLoading(true)

const res=await axios.post(
"http://localhost:5000/api/login",
{email,password}
)

// ✅ SUCCESS
if(res.data.success){

localStorage.setItem("token",res.data.token)

setMsg("Login Successful")
setMsgType("success")

setTimeout(()=>{
setPage("dashboard")
},800)

}else{

setMsg(res.data.msg || "Login failed")
setMsgType("error")

}

}catch(error){

console.log(error)
setMsg("Server error")
setMsgType("error")

}

setLoading(false)

}

// ================= UI =================
return(

<div className="auth-container">

<div className="auth-card">

<h2>LOGIN PAGE</h2>

{/* MESSAGE */}
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

<button onClick={login}>
{loading ? "Logging in..." : "Login"}
</button>

<p className="link" onClick={()=>setPage("register")}>
Create Account
</p>

<p className="link" onClick={()=>setPage("forgot")}>
Forgot Password
</p>

</div>

</div>

)

}