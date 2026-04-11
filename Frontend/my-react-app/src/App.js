import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/Dashboard";
import MonthlySetup from "./components/MonthlySetup";
import LoanOffers from "./components/LoanOffers";
import Transactions from "./components/Transactions";
 import LoanForm from "./components/LoanForm";
import LoanResults from "./components/LoanResults";
 // ⚠️ IMPORTANT (you forgot this)

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/setup" element={<MonthlySetup />} />

        {/* ✅ NEW ROUTE */}

        <Route path="/loan-offers" element={<LoanOffers />} />
          <Route path="/loan-form" element={<LoanForm />} />
        <Route path="/loan-results" element={<LoanResults />} />
       

      </Routes>
    </Router>
  );
}

export default App;