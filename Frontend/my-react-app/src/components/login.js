import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiClock } from "react-icons/fi";
import "./login.css";

const Login = () => {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard (NO ALERT)
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

  return (
    <div className="login-container">
      
      {/* LEFT SIDE */}
      <div className="login-left">
        <Link to="/" className="auth-brand">
          <span className="brand-icon">✦</span>
          <h2>ExpenseAI</h2>
        </Link>

        <div className="auth-content-wrapper">
          <div className="sub-brand">
            <span className="bank-icon">🏛️</span>
            <h3>LoanPro</h3>
          </div>

          <h1>Welcome Back</h1>
          <p>
            Sign in to LoanPro to manage your secure loan services
            and track your financial health.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <FiShield className="feature-icon" />
              <span>Secure Authentication</span>
            </div>
            <div className="auth-feature">
              <FiClock className="feature-icon" />
              <span>Instant Loan Approval</span>
            </div>
            <div className="auth-feature">
              <FiLock className="feature-icon" />
              <span>Protected Data Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>

          {error && (
            <p
              style={{
                color: "#ef4444",
                textAlign: "center",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="bottom-text">
            Don't have an account? <Link to="/register">Create one here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;