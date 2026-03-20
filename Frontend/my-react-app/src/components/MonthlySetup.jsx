import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function MonthlySetup() {
  const [month, setMonth] = useState("");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([{ category: "", amount: "" }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!month) return;
    const checkExistingBudget = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/budget/${month}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIncome(data.income);
          setExpenses(data.expenses);
          setMessage("⚠ Budget already exists for this month. You are editing it.");
        } else {
          setIncome("");
          setExpenses([{ category: "", amount: "" }]);
          setMessage("");
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkExistingBudget();
  }, [month]);

  const handleExpenseChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const addExpenseField = () => {
    setExpenses([...expenses, { category: "", amount: "" }]);
  };

  const removeExpenseField = (index) => {
    if (expenses.length > 1) {
      const updated = [...expenses];
      updated.splice(index, 1);
      setExpenses(updated);
    }
  };

  // --- AI 50/30/20 AUTO-DISTRIBUTION ---
  const handleAutoDistribute = () => {
    if (!income) {
      setMessage("Please enter an Expected Income first.");
      return;
    }
    const val = Number(income);
    setExpenses([
      { category: "Needs (Rent, Groceries...)", amount: (val * 0.5).toFixed(0) },
      { category: "Wants (Dining, Hobbies...)", amount: (val * 0.3).toFixed(0) },
      { category: "Savings & Investments", amount: (val * 0.2).toFixed(0) },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const data = { month, income: Number(income), expenses, totalExpense };

    try {
      const res = await fetch("http://localhost:8080/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) {
        setMessage("❌ " + (result.message || "Error saving budget"));
      } else {
        setMessage("✅ Master Budget Active!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server Error");
    }
    setLoading(false);
  };

  // Dynamic Graph Calculation
  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const unallocated = income ? Math.max(0, Number(income) - totalExpense) : 0;
  const isOverBudget = income ? totalExpense > Number(income) : false;

  const COLORS = ['#38bdf8', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

  const chartData = [
    ...expenses.filter(e => e.amount).map((exp, i) => ({
      name: exp.category || `Category ${i+1}`,
      value: Number(exp.amount),
      color: COLORS[i % COLORS.length]
    })),
    // Render unallocated as a ghost slice if income exists
    ...(unallocated > 0 ? [{ name: 'Unallocated', value: unallocated, color: 'rgba(255,255,255,0.05)' }] : [])
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100 }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: "white", fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>Smart Budget AI</h2>
        <button onClick={handleAutoDistribute} className="glass-button secondary ai-glow-btn">✨ AI 50/30/20 Plan</button>
      </div>

      <div className="budget-grid">
        
        {/* LEFT COLUMN: FORM */}
        <div className="glass-card budget-form" style={{ padding: "2rem" }}>
          
          {message && (
            <div className={`alert-msg ${message.includes('✅') ? 'success' : 'warning'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="input-group">
                <label>Target Month</label>
                <input type="month" className="glass-input" value={month} onChange={(e) => setMonth(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Expected Total Income (₹)</label>
                <input type="number" className="glass-input highlight-input" placeholder="e.g. 50000" value={income} onChange={(e) => setIncome(e.target.value)} required />
              </div>
            </div>

            <div className="expenses-section" style={{ marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#f8fafc", fontSize: "1.1rem" }}>Predictive Expense Allocation</h3>
              
              {expenses.map((exp, index) => (
                <motion.div key={index} className="expense-row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "grid", gridTemplateColumns: expenses.length > 1 ? "12px 2fr 2fr auto" : "12px 2fr 2fr", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
                  <div className="cat-color-badge" style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                  <input type="text" className="glass-input" placeholder="Category (e.g. Rent)" value={exp.category} onChange={(e) => handleExpenseChange(index, "category", e.target.value)} required />
                  <input type="number" className="glass-input" placeholder="₹" value={exp.amount} onChange={(e) => handleExpenseChange(index, "amount", e.target.value)} required />
                  {expenses.length > 1 && (
                    <button type="button" onClick={() => removeExpenseField(index)} className="delete-btn icon-only" title="Remove">✕</button>
                  )}
                </motion.div>
              ))}

              <button type="button" onClick={addExpenseField} className="glass-button secondary" style={{ marginTop: "0.5rem", display: "inline-block", padding: "0.5rem 1rem" }}>
                + Add Allocation
              </button>
            </div>

            <button type="submit" disabled={loading} className="glass-button" style={{ marginTop: "1rem" }}>
              {loading ? "Optimizing Database..." : "Publish Smart Budget"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUALIZER */}
        <div className="glass-card budget-visualizer" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#cbd5e1" }}>Income Utilization</h3>
          
          <div className="capacity-stat">
            <span style={{ fontSize: '2rem', fontFamily: "'Playfair Display', serif", color: isOverBudget ? '#f43f5e' : '#10b981' }}>{income ? Math.min((totalExpense / Number(income)) * 100, 100).toFixed(1) : 0}%</span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Allocated</span>
          </div>

          <div style={{ width: '100%', height: '300px', margin: '1rem 0', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={chartData} 
                  cx="50%" cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}}
                  formatter={(val) => `₹${val}`}
                />
              </PieChart>
            </ResponsiveContainer>
            {isOverBudget && (
              <div className="overbudget-alert">
                OVER BUDGET BY ₹{totalExpense - Number(income)}
              </div>
            )}
          </div>

          {/* Allocation Legend */}
          <div className="allocation-legend">
            {chartData.map((d, i) => (
              <div key={i} className="legend-item">
                <span className="dot" style={{ background: d.color }}></span>
                <span className="label">{d.name}</span>
                <span className="bold">₹{d.value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default MonthlySetup;