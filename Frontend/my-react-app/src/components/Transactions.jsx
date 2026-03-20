import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Coffee, Car, Home, ShoppingBag, Zap, CreditCard } from "lucide-react";

function Transactions() {
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [budgetLimit, setBudgetLimit] = useState(null);
  const [spentThisMonth, setSpentThisMonth] = useState(0);
  
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const getDaysLeftInMonth = () => {
    const today = new Date();
    const endingDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return endingDate.getDate() - today.getDate() || 1; // Prevents division by 0
  };

  const loadData = useCallback(async () => {
    try {
      // 1. Fetch Transactions
      const response = await fetch("http://localhost:8080/api/transactions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      
      const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
      
      // Calculate spent this month
      const monthlySpent = data
        .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
        .reduce((sum, curr) => sum + curr.amount, 0);
      
      setSpentThisMonth(monthlySpent);

      // Group by Date for UI
      const grouped = {};
      data.forEach((t) => {
        const dateStr = new Date(t.date).toLocaleDateString();
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(t);
      });
      setGroupedTransactions(grouped);

      // 2. Fetch Budget Array to get limits
      const budgetRes = await fetch("http://localhost:8080/api/budget", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (budgetRes.ok) {
        const budgets = await budgetRes.json();
        // find active monthly budget
        const activeBudget = budgets.find(b => b.month === currentMonth);
        if (activeBudget && activeBudget.income) {
          setBudgetLimit(activeBudget.totalExpense || (activeBudget.income * 0.8)); // fallback to 80% rule
        }
      }
    } catch (error) {
      console.error("Error loading transaction logic", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);


  // Quick Log Templates
  const quickLogs = [
    { icon: <Coffee size={16}/>, label: "Food & Dining", cat: "Food", amt: 250 },
    { icon: <Car size={16}/>, label: "Transport", cat: "Transport", amt: 150 },
    { icon: <ShoppingBag size={16}/>, label: "Shopping", cat: "Shopping", amt: 1000 },
    { icon: <Zap size={16}/>, label: "Utilities", cat: "Bills", amt: 800 },
  ];

  const triggerQuickLog = (cat, amt) => {
    setForm({ ...form, category: cat, amount: amt });
    document.getElementById('amt-input').focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ ...form, amount: Number(form.amount), type: "expense" })
      });

      if (response.ok) {
        setForm({ ...form, amount: "", description: "", category: "" }); // keep date
        loadData();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      loadData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Gamification Maths
  const remainingBudget = budgetLimit ? budgetLimit - spentThisMonth : null;
  const safeDailyAllowance = remainingBudget ? Math.max(0, (remainingBudget / getDaysLeftInMonth()).toFixed(0)) : "Not Set";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100 }}>
      {/* HEADER SECTION WITH GAMIFIED ALLOWANCE */}
      <div className="allowance-banner glass-card" style={{ marginBottom: "2rem", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", color: "#f8fafc", fontSize: "1.2rem", fontFamily: "'Inter', sans-serif" }}>Safe Daily Allowance</h2>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
            {budgetLimit ? `Based on ₹${remainingBudget} left over ${getDaysLeftInMonth()} days` : "Set a monthly budget to unlock insights"}
          </p>
        </div>
        <div>
          <h1 style={{ margin: 0, color: "#10b981", fontSize: "2.5rem", fontFamily: "'Playfair Display', serif", textShadow: "0 0 20px rgba(16,185,129,0.3)"}}>
            {budgetLimit ? `₹${safeDailyAllowance}` : "---"}
          </h1>
        </div>
      </div>

      <div className="transactions-layout">
        
        {/* LEFT COLUMN: INTERACTIVE FORM & QUICK LOGS */}
        <div className="tx-form-container">
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.1rem", color: "#f8fafc" }}>Fast Track Logging</h3>
            
            {/* QUICK LOG BUTTONS */}
            <div className="quick-logs">
              {quickLogs.map((ql, i) => (
                <button type="button" key={i} className="quick-log-btn" onClick={() => triggerQuickLog(ql.cat, ql.amt)}>
                  <div className="icon-ring">{ql.icon}</div>
                  <span>{ql.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group">
                  <label>Amount (₹)</label>
                  <input id="amt-input" type="number" className="glass-input highlight-input" placeholder="0" value={form.amount} required onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <input type="text" className="glass-input" placeholder="e.g. Rent" value={form.category} required onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
              </div>

              <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" className="glass-input" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Description (Optional)</label>
                  <input type="text" className="glass-input" placeholder="Brief note..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="glass-button" style={{ marginTop: "10px" }}>Log Transaction</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: CHRONOLOGICAL TIMELINE FEED */}
        <div className="tx-feed-container glass-panel" style={{ padding: "2rem", borderRadius: "16px", overflowY: "auto", maxHeight: "600px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "2rem", fontSize: "1.2rem", color: "#f8fafc" }}>Chronological Feed</h3>
          
          {Object.keys(groupedTransactions).length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "20%" }}>No timeline data available.</p>
          ) : (
            <div className="timeline-wrapper">
              {Object.entries(groupedTransactions).map(([date, items], idx) => {
                const total = items.reduce((s, t) => s + t.amount, 0);
                return (
                  <motion.div key={date} className="timeline-day" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}>
                    <div className="timeline-header">
                      <div className="day-badge">{date.split('/')[1] || date}</div> 
                      <span className="day-total">- ₹{total.toLocaleString()}</span>
                    </div>
                    
                    <div className="timeline-items">
                      {items.map((t) => (
                        <div key={t._id} className="timeline-card glass-card">
                          <div className="tx-info">
                            <div className="tx-icon" style={{ background: t.category.toLowerCase().includes('food') ? 'rgba(56,189,248,0.2)' : 'rgba(16,185,129,0.2)', color: t.category.toLowerCase().includes('food') ? '#38bdf8' : '#10b981' }}>
                              <CreditCard size={18} />
                            </div>
                            <div>
                              <h4>{t.category}</h4>
                              {t.description && <p>{t.description}</p>}
                            </div>
                          </div>
                          <div className="tx-action">
                            <span className="tx-amt" style={{ color: t.type === 'income' ? '#10b981' : '#f8fafc' }}>
                              {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                            </span>
                            <button onClick={() => handleDelete(t._id)} className="delete-icon" title="Delete">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}

export default Transactions;