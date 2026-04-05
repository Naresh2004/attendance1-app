import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Auth.css";

// ✅ CORRECT API
const API = "https://attendance-backend-lghd.onrender.com/api/auth";

export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  // ================= AUTO LOGIN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setPage("dashboard");
    }
  }, [setPage]);

  // ================= AUTO HIDE MESSAGE =================
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  // ================= LOGIN =================
  const login = async () => {
    if (!email || !password) {
      setMsg("Please enter email and password");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/login`, {
        email: email.trim(),
        password,
      });

      if (res.data.success) {
        // save token
        localStorage.setItem("token", res.data.token);

        setMsg("Login Successful ✅");
        setMsgType("success");

        // redirect
        setTimeout(() => {
          setPage("dashboard");
        }, 500);

      } else {
        setMsg(res.data.msg || "Login failed");
        setMsgType("error");
      }

    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);

      setMsg(
        error.response?.data?.msg ||
        "Server error / backend issue"
      );
      setMsgType("error");
    }

    setLoading(false);
  };

  // ================= UI =================
  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Login</h2>

        {/* MESSAGE */}
        {msg && (
          <p className={`msg ${msgType}`}>
            {msg}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="password-box">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* LINKS */}
        <p className="link" onClick={() => setPage("register")}>
          Create Account
        </p>

        <p className="link" onClick={() => setPage("forgot")}>
          Forgot Password
        </p>

      </div>
    </div>
  );
}