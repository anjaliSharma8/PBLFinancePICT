import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoanResultsPage from "./components/LoanResultsPage";

import Home from "./components/Home";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/Dashboard";
import MonthlySetup from "./components/MonthlySetup";
import LoanOffers from "./components/LoanOffers";
import Transactions from "./components/Transactions";
 import LoanPage from "./components/LoanPage";
 import Favorites from "./components/Favorites";

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
        {/* <Route path="/loan-results" element={<LoanResultsPage />} /> */}
        <Route path="/favorites" element={<Favorites />} />

        {/* ✅ NEW ROUTE */}

        <Route path="/loan-offers" element={<LoanOffers />} />
        <Route path="/loan-form" element={<LoanPage />} />
         
       

      </Routes>
    </Router>
  );
}

export default App;