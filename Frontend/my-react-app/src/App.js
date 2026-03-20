import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import MonthlySetup from "./components/MonthlySetup";


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
      </Routes>
    </Router>
  );
}

export default App;
