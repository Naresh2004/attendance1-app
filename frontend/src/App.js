// import React,{useState} from "react"
// import Login from "./pages/Login"
// import Register from "./pages/Register"
// import Forgot from "./pages/Forgot"

// function App(){

// const [page,setPage]=useState("login")

// return(

// <div style={{padding:"40px"}}>

// <h1>Enterprise Auth System</h1>

// <button onClick={()=>setPage("login")}>Login</button>
// <button onClick={()=>setPage("register")}>Register</button>
// <button onClick={()=>setPage("forgot")}>Forgot Password</button>

// {page==="login" && <Login/>}
// {page==="register" && <Register/>}
// {page==="forgot" && <Forgot/>}

// </div>

// )

// }

// export default App
import React,{useState,useEffect} from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Forgot from "./pages/Forgot"
import Dashboard from "./pages/Dashboard"
import "./Auth.css"

function App(){

const [page,setPage]=useState("login")

// auto login if token exists
useEffect(()=>{

const token=localStorage.getItem("token")

if(token){
setPage("dashboard")
}

},[])

return(

<div className="main-container">

{/* Page Title */}

{page==="login" && <h1 className="title">LOGIN PAGE</h1>}

{page==="register" && <h1 className="title">CREATE ACCOUNT</h1>}

{page==="forgot" && <h1 className="title">RESET PASSWORD</h1>}

{page==="dashboard" && <h1 className="title">ATTENDANCE DASHBOARD</h1>}

<div className="page-box">

{/* Login Page */}

{page==="login" && (
<Login setPage={setPage}/>
)}

{/* Register Page */}

{page==="register" && (
<Register setPage={setPage}/>
)}

{/* Forgot Password */}

{page==="forgot" && (
<Forgot setPage={setPage}/>
)}

{/* Attendance Dashboard */}

{page==="dashboard" && (
<Dashboard setPage={setPage}/>
)}

</div>

</div>

)

}

export default App
