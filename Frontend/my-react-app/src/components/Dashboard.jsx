import React, { useEffect, useState } from "react";
import AppNavbar from "./AppNavbar";
import financeVideo from "../assets/finance.mp4";
import "./dashboard.css";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/transactions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <>
      <AppNavbar />

      {/* VIDEO BACKGROUND */}
      <div className="video-container">
        <video autoPlay loop muted className="background-video">
          <source src={financeVideo} type="video/mp4" />
        </video>

        <div className="overlay">
          <h1 className="hero-title">Welcome Back 👋</h1>
          <p className="hero-subtitle">Track. Analyze. Grow.</p>
        </div>
      </div>

      <div className="dashboard-container">

        {/* SUMMARY CARDS */}
        <div className="card-container">
          <div className="card income">
            <h3>Total Income</h3>
            <h2>₹{income}</h2>
          </div>

          <div className="card expense">
            <h3>Total Expense</h3>
            <h2>₹{expense}</h2>
          </div>

          <div className="card balance">
            <h3>Current Balance</h3>
            <h2>₹{balance}</h2>
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="recent-section">
          <h3>Recent Transactions</h3>

          {recentTransactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(t => (
                  <tr key={t._id}>
                    <td>₹{t.amount}</td>
                    <td>{t.type}</td>
                    <td>{t.category}</td>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  );
}

export default Dashboard;