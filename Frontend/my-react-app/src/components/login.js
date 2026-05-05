import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiClock, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setForgotMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage(data.message);
        setForgotStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    setError("");
    setForgotMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp, password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage(data.message + " Redirecting...");
        setTimeout(() => {
          setShowForgot(false);
          setForgotStep(1);
          setForgotMessage("");
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const formVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 80, delay: 0.3 } }
  };

  return (
    <div className="auth-wrapper">
      <Link to="/" className="back-btn">
        <FiArrowLeft /> Back to Home
      </Link>
      
      {/* Background Animated Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>
      
      <div className="auth-container">
        
        {/* LEFT SIDE (Branding) */}
        <motion.div 
          className="auth-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link to="/" className="auth-brand">
              <span className="brand-logo">✦</span>
              <h2>VaultCore</h2>
            </Link>
          </motion.div>

          <div className="auth-content">
            <motion.div variants={itemVariants} className="badge">
              <span className="badge-icon">⚡</span>
              <span>Next-Gen Financial Operating System</span>
            </motion.div>

            <motion.h1 variants={itemVariants}>
              Welcome back to <br/>
              <span className="text-gradient">Intelligent Finance</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="auth-desc">
              Sign in to access your AI-powered loan matches, automated budgeting, and real-time wealth analytics.
            </motion.p>

            <motion.div variants={containerVariants} className="auth-features">
              <motion.div variants={itemVariants} className="feature-item">
                <div className="feature-icon-wrapper"><FiShield /></div>
                <span>Bank-level 256-bit encryption</span>
              </motion.div>
              <motion.div variants={itemVariants} className="feature-item">
                <div className="feature-icon-wrapper"><FiClock /></div>
                <span>Instant pre-approvals in seconds</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT SIDE (Form) */}
        <motion.div 
          className="auth-right"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="glass-form-card">
            {!showForgot && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-header">
                <h2>Sign In</h2>
                <p>Enter your details to access your dashboard</p>
              </div>

              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <div className="input-group">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="input-highlight"></div>
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
                <div className="input-highlight"></div>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-link" onClick={(e) => {
                  e.preventDefault();
                  setShowForgot(true);
                }}>Forgot Password?</a>
              </div>

              <motion.button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Authenticating..." : (
                  <>Sign In <FiArrowRight className="btn-icon" /></>
                )}
              </motion.button>

              <p className="auth-footer-text">
                Don't have an account? <Link to="/register">Create one now</Link>
              </p>
            </form>
          )}

          {showForgot && (
            <form className="auth-form" onSubmit={forgotStep === 1 ? handleForgotSubmit : handleResetSubmit}>
              <div className="form-header">
                <h2>{forgotStep === 1 ? "Reset Password" : "Create New Password"}</h2>
                <p>{forgotStep === 1 ? "Enter your email to receive a 6-digit code" : "Enter the code sent to your email and your new password"}</p>
              </div>

              {forgotMessage && <div className="success-message">{forgotMessage}</div>}
              {error && <div className="error-message">{error}</div>}

              {forgotStep === 1 ? (
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  <div className="input-highlight"></div>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <FiShield className="input-icon" />
                    <input
                      type="text"
                      placeholder="6-Digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength="6"
                    />
                    <div className="input-highlight"></div>
                  </div>

                  <div className="input-group">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <div className="input-highlight"></div>
                  </div>

                  <div className="input-group">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="input-highlight"></div>
                  </div>
                </>
              )}

              <motion.button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Processing..." : (forgotStep === 1 ? "Send OTP Code" : "Update Password")}
              </motion.button>

              <p className="auth-footer-text">
                <a href="#" onClick={(e) => { 
                  e.preventDefault(); 
                  setShowForgot(false); 
                  setForgotStep(1);
                  setError(""); 
                  setForgotMessage("");
                }}>Back to Login</a>
              </p>
            </form>
          )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;