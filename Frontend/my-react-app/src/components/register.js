import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiShield, FiClock } from "react-icons/fi";
import "./register.css"; 

const Register = () => {
  // 1. Set up state for our form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  // 2. Handle the form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Make sure this URL matches your actual backend route setup!
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please sign in.");
        navigate("/login"); // Send them to the login page
      } else {
        // Show the error message from the backend (e.g., "User already exists")
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server. Is your backend running?");
    }
  };

  return (
    <div className="register-container">
      
      {/* LEFT SIDE (BRANDING) */}
      <div className="register-left">
        <Link to="/" className="auth-brand">
          <span className="brand-icon">✦</span>
          <h2>ExpenseAI</h2>
        </Link>
        
        <div className="auth-content-wrapper">
          <div className="sub-brand">
            <span className="bank-icon">🏛️</span>
            <h3>LoanPro</h3>
          </div>
          
          <h1>Create Your Account</h1>
          <p>Join LoanPro and get instant access to secure loan services.</p>
          
          <div className="auth-features">
            <div className="auth-feature"><FiShield className="feature-icon" /><span>Secure Authentication</span></div>
            <div className="auth-feature"><FiClock className="feature-icon" /><span>Instant Loan Approval</span></div>
            <div className="auth-feature"><FiLock className="feature-icon" /><span>Protected Data Privacy</span></div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="register-right">
        {/* 3. Attach the submit handler to the form */}
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Create an Account</h2>
          
          {/* Display errors if there are any */}
          {error && <p style={{ color: "#ef4444", textAlign: "center", marginBottom: "15px" }}>{error}</p>}
          
          <div className="input-group">
            <FiUser className="input-icon" />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <FiMail className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-btn">
            Sign Up
          </button>

          <p className="bottom-text">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>

    </div>
  );
};

export default Register;