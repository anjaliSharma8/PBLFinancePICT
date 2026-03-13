import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import MonthlySetup from "./components/MonthlySetup";


function App() {
  return (
    <Router>
      <div className="app">
        {/* NAVBAR */}
        <header className="navbar">
          <div className="nav-container">
            <div className="logo">
              <Link to="/" className="logo-link">
                <span className="logo-icon">✦</span> ExpenseAI
              </Link>
            </div>

            <nav className="nav-links">
              <Link to="/">Home</Link>
              {/* <Link to="/">Solutions</Link> */}
              <Link to="/">Developers</Link>
              <Link to="/">Company</Link>
            </nav>

            <div className="nav-buttons">
              <Link to="/login">
                <button className="btn-outline">Sign in</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary">Start now →</button>
              </Link>
            </div>
          </div>
        </header>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/setup" element={<MonthlySetup />} />
        </Routes>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-content">
            <h2>ExpenseAI</h2>
            <p>Smart finance for modern users.</p>
            <p>© 2026 ExpenseAI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;