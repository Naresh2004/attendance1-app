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


import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Dashboard from "./pages/Dashboard";
import "./Auth.css";

function App() {
  const [page, setPage] = useState(null);

  // ================= CHECK LOGIN =================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setPage("dashboard");
    } else {
      setPage("login");
    }
  }, []);

  // ================= LOADING =================
  if (page === null) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // ================= TITLE =================
  const getTitle = () => {
    switch (page) {
      case "login":
        return "LOGIN PAGE";
      case "register":
        return "CREATE ACCOUNT";
      case "forgot":
        return "RESET PASSWORD";
      case "dashboard":
        return "ATTENDANCE DASHBOARD";
      default:
        return "";
    }
  };

  // ================= PAGE RENDER =================
  const renderPage = () => {
    switch (page) {
      case "login":
        return <Login setPage={setPage} />;
      case "register":
        return <Register setPage={setPage} />;
      case "forgot":
        return <Forgot setPage={setPage} />;
      case "dashboard":
        return <Dashboard setPage={setPage} />;
      default:
        return <Login setPage={setPage} />;
    }
  };

  return (
    <div className="main-container">
      
      <h1 className="title">{getTitle()}</h1>

      <div className="page-box">
        {renderPage()}
      </div>

    </div>
  );
}

export default App;