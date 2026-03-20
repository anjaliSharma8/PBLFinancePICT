import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiShield, FiClock, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import "./register.css"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please sign in.");
        navigate("/login"); 
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server. Is your backend running?");
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
              <span className="badge-icon">🏛️</span>
              <span>Join the Future of Banking</span>
            </motion.div>

            <motion.h1 variants={itemVariants}>
              Create your <br/>
              <span className="text-gradient">Secure Account</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="auth-desc">
              Join thousands of users scaling their financial success securely through VaultCore.
            </motion.p>

            <motion.div variants={containerVariants} className="auth-features">
              <motion.div variants={itemVariants} className="feature-item">
                <div className="feature-icon-wrapper"><FiShield /></div>
                <span>Uncompromised Data Privacy</span>
              </motion.div>
              <motion.div variants={itemVariants} className="feature-item">
                <div className="feature-icon-wrapper"><FiClock /></div>
                <span>Less than 2 minutes to apply</span>
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
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-header">
                <h2>Create Account</h2>
                <p>Register to start your financial journey</p>
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
                <FiUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="input-highlight"></div>
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
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  I agree to the <a href="#" className="forgot-link">Terms & Conditions</a>
                </label>
              </div>

              <motion.button 
                type="submit" 
                className="submit-btn" 
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Creating Account..." : (
                  <>Sign Up <FiArrowRight className="btn-icon" /></>
                )}
              </motion.button>

              <p className="auth-footer-text">
                Already have an account? <Link to="/login">Sign in here</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;