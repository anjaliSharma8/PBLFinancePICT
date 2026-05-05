import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { io } from "socket.io-client";
import {
  LayoutDashboard, Wallet, CreditCard, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Bell, FileText, Download, Calendar, Zap
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './dashboard.css';
import Transactions from './Transactions';
import MonthlySetup from './MonthlySetup';
import AIChat from './AIChat';
import LoanOffers from './LoanOffers';



const Dashboard = () => {
  const [creditScore, setCreditScore] = useState(600);
  const [activeView, setActiveView] = useState("overview");
  // State for original functionality
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("User");

  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [budgetIncome, setBudgetIncome] = useState(0);

  // --- REPORT STATES ---
  const [reportRange, setReportRange] = useState({ start: "", end: "" });
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [tempScore, setTempScore] = useState("");
  const [chartMonth, setChartMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [activeToast, setActiveToast] = useState(null); // { title, message, type }

  useEffect(() => {
    // Attempt to load user name
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUserName(userObj.name || "User");
        if (userObj.creditScore !== undefined && userObj.creditScore !== null) {
          setCreditScore(Number(userObj.creditScore));
        } else {
          setCreditScore(null); // Explicitly null if not set
        }
      } catch (e) { console.error("Error parsing user"); }
    }

    // Auto-refresh data when returning to the Overview tab
    if (activeView === 'overview') {
      fetchTransactions();
      fetchBudget();
      fetchAlerts();
      requestNotificationPermission();
    }
  }, [activeView]);

  // 🔥 GLOBAL REAL-TIME SOCKET (STAYS CONNECTED ACROSS TABS)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      console.log("🔔 Notification Socket: Connecting...");
      const socket = io("http://localhost:8080");

      socket.on("connect", () => {
        console.log("🔔 Notification Socket: Connected! ✅");
        socket.emit("join", storedUser.id);
      });

      socket.on("notification", (data) => {
        console.log("🔔 Received Notification:", data);
        fireBrowserNotification(data.title, data.message);
        setActiveToast({ title: data.title, message: data.message, type: 'alert' });
        setTimeout(() => setActiveToast(null), 6000);
        fetchAlerts();
      });

      return () => {
        socket.off("notification");
        socket.disconnect();
      };
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };

  const fireBrowserNotification = (title, body) => {
    const FINANCE_ICON = "https://cdn-icons-png.flaticon.com/512/2845/2845812.png"; // Gold Coin/Safe Icon
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`💰 ${title}`, {
        body,
        icon: FINANCE_ICON,
        badge: FINANCE_ICON,
        silent: false,
      });
    }
  };



  const fetchBudget = async () => {
    try {
      const month = new Date().toISOString().slice(0, 7); // YYYY-MM
      const res = await fetch(`http://localhost:8080/api/budget/${month}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBudgetIncome(data.income || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      let userId = "";
      if (storedUser) {
        try { userId = JSON.parse(storedUser).id; } catch (e) { }
      }
      const res = await fetch(`http://127.0.0.1:5001/api/alerts?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.log("Python AI API offline or booting...", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/transactions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations based on actual backend data
  const income = budgetIncome; // Using Planned Budget Income as requested

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  useEffect(() => {
    if (income === 0 || creditScore === null) return;
    // (Logic for auto-calculating score can be removed or kept as a base)
    // For now, we respect the user's manual input as requested.
  }, [income, expense])

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!tempScore || tempScore < 300 || tempScore > 850) return alert("Please enter a valid score (300-850)");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:8080/api/auth/update-credit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUser.id, creditScore: Number(tempScore) })
      });
      if (res.ok) {
        const data = await res.json();
        setCreditScore(data.creditScore);
        setIsEditingScore(false);
        // Update local storage
        storedUser.creditScore = data.creditScore;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
    } catch (err) {
      console.error(err);
    }
  };


  const balance = budgetIncome - expense;
  const recentTransactions = transactions.slice(0, 5);

  // --- DYNAMIC CHART DATA ---
  const expenseTrendData = React.useMemo(() => {
    const [year, month] = chartMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const data = [];

    // Create array for all days in selected month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${chartMonth}-${String(i).padStart(2, '0')}`;
      data.push({
        dateFull: dateString,
        day: i, // Just show the date number for cleaner X-axis
        income: 0,
        expense: 0
      });
    }

    transactions.forEach(t => {
      const tDate = new Date(t.date).toISOString().split('T')[0];
      const targetDay = data.find(d => d.dateFull === tDate);
      if (targetDay) {
        if (t.type === 'income') targetDay.income += Number(t.amount);
        if (t.type === 'expense') targetDay.expense += Number(t.amount);
      }
    });

    return data;
  }, [transactions, chartMonth]);

  const handleGenerateReport = async () => {
    if (!reportRange.start || !reportRange.end) return alert("Please select a date range.");
    setIsGenerating(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://127.0.0.1:5001/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: storedUser.id,
          startDate: reportRange.start,
          endDate: reportRange.end
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportData || !reportData.reportData) return alert("No report data available to download.");
    const pdf = new jsPDF();
    const data = reportData.reportData;

    // Header
    pdf.setFontSize(22);
    pdf.setTextColor(99, 102, 241);
    pdf.text("VaultCore Financial Audit", 14, 20);

    pdf.setFontSize(12);
    pdf.setTextColor(100);
    pdf.text(`Period: ${data.period}`, 14, 30);

    // Summary
    autoTable(pdf, {
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ['Total Period Income', `INR ${data.overallIncome.toLocaleString()}`],
        ['Total Period Expenses', `INR ${data.overallExpense.toLocaleString()}`],
        ['Net Period Savings', `INR ${data.overallSavings.toLocaleString()}`],
      ],
      theme: 'grid',
      headStyles: { fillStyle: [99, 102, 241] }
    });

    // Loop through each month for detailed breakdown
    if (data.monthlyBreakdown && data.monthlyBreakdown.length > 0) {
      data.monthlyBreakdown.forEach((monthData) => {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.setTextColor(99, 102, 241);
        pdf.text(`Analysis: ${monthData.month}`, 14, 20);

        // Monthly Summary
        autoTable(pdf, {
          startY: 30,
          head: [['Metric', 'Amount']],
          body: [
            ['Monthly Income', `INR ${monthData.income.toLocaleString()}`],
            ['Monthly Spent', `INR ${monthData.expense.toLocaleString()}`],
            ['Monthly Savings', `INR ${monthData.savings.toLocaleString()}`],
            ['Top Category', monthData.topCategory]
          ],
          theme: 'grid'
        });

        // Budget Audit for this month
        if (monthData.budgetAudit && monthData.budgetAudit.length > 0) {
          pdf.setFontSize(14);
          pdf.setTextColor(0);
          pdf.text("Budget vs Actual", 14, pdf.lastAutoTable.finalY + 15);

          const budgetTableData = monthData.budgetAudit.map(b => [
            b.category,
            `INR ${b.budgeted.toLocaleString()}`,
            `INR ${b.spent.toLocaleString()}`,
            `INR ${b.remaining.toLocaleString()}`
          ]);

          autoTable(pdf, {
            startY: pdf.lastAutoTable.finalY + 20,
            head: [['Category', 'Budgeted', 'Spent', 'Remaining']],
            body: budgetTableData,
            theme: 'striped',
            headStyles: { fillStyle: [16, 185, 129] }
          });
        }
      });
    }

    // Removed AI Suggestions Section

    // FINAL SECTION: FULL TRANSACTION LEDGER
    if (data.transactions && data.transactions.length > 0) {
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.setTextColor(0);
      pdf.text("Full Transaction Ledger", 14, 20);
      pdf.setFontSize(10);
      pdf.text(`Complete record from ${reportRange.start} to ${reportRange.end}`, 14, 28);

      const fullLedgerData = data.transactions
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Chronological order
        .map(t => [
          new Date(t.date).toLocaleDateString(),
          t.category,
          t.name || t.description || '-',
          t.type === 'income' ? `+INR ${t.amount.toLocaleString()}` : `-INR ${t.amount.toLocaleString()}`
        ]);

      autoTable(pdf, {
        startY: 35,
        head: [['Date', 'Category', 'Description', 'Amount']],
        body: fullLedgerData,
        headStyles: { fillStyle: [71, 85, 105] }, // Slate gray header
        alternateRowStyles: { fillStyle: [248, 250, 252] }
      });
    }

    pdf.save(`VaultCore_Full_Audit_${reportRange.start}_to_${reportRange.end}.pdf`);
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Background Animated Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      <div className="saas-dashboard">
        {/* SIDEBAR */}
        <motion.aside className="sidebar glass-panel" initial={{ x: -250 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 100 }}>
          <div className="sidebar-brand">
            <span className="brand-logo" style={{ fontSize: '2rem' }}>✦</span>
            <div>
              <h2>VaultCore</h2>
              <p>PERSONAL FINANCE</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <a href="#" className={`nav-item ${activeView === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('overview'); }}><LayoutDashboard size={20} /> Overview</a>
            <a href="#" className={`nav-item ${activeView === 'transactions' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('transactions'); }}><Wallet size={20} /> Transactions</a>

            <a
              href="#"
              className={`nav-item ${activeView === 'loan' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveView('loan'); }}
            >
              <CreditCard size={20} /> Loan Offers
            </a>
            <a href="#" className={`nav-item ${activeView === 'budget' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('budget'); }}><PieChart size={20} /> Budget Setup</a>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <a href="#" className="nav-item logout-item" onClick={(e) => {
                e.preventDefault();
                if (window.confirm("Are you sure you want to logout?")) {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }
              }} style={{ color: '#f43f5e' }}>
                <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}><ArrowUpRight size={20} /></span>
                Logout
              </a>
            </div>
          </nav>
        </motion.aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-content">

          {activeView === "overview" && (
            <>
              <motion.div className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative' }}>
                <div>
                  <h1>Welcome back, {userName}</h1>
                  <p>Here is your daily expense breakdown and latest loan matches.</p>
                </div>

                {/* NOTIFICATIONS BELL */}
                <div className="header-actions">
                  <div className="notification-bell glass-card" onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={24} color="#f8fafc" />
                    {alerts.length > 0 && <span className="badge-dot pulse"></span>}
                  </div>
                  {showNotifications && (
                    <div className="notifications-dropdown glass-card">
                      <h4>AI Insights & Alerts</h4>
                      {alerts.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Running analysis... nothing to report.</p> : (
                        alerts.map((al, idx) => (
                          <div key={idx} className={`alert-item ${al.type}`}>
                            {al.message}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* KPI ROW */}
              <motion.div className="kpi-row" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div className="kpi-card glass-card" variants={itemVariants}>
                  <div className="kpi-header">
                    <h3>Current Balance</h3>
                    <div className="kpi-icon" style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.1)' }}><Wallet size={20} /></div>
                  </div>
                  <h2 style={{ color: '#38bdf8', textShadow: '0 0 15px rgba(56,189,248,0.4)' }}>₹{balance.toLocaleString()}</h2>
                  <p className="kpi-subtext">Available in all accounts</p>
                </motion.div>

                <motion.div className="kpi-card glass-card" variants={itemVariants}>
                  <div className="kpi-header">
                    <h3>Total Budget</h3>
                    <div className="kpi-icon" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}><ArrowUpRight size={20} /></div>
                  </div>
                  <h2 style={{ color: '#10b981', textShadow: '0 0 15px rgba(16,185,129,0.4)' }}>₹{income.toLocaleString()}</h2>
                  <p className="kpi-subtext">+12% from last month</p>
                </motion.div>

                <motion.div className="kpi-card glass-card" variants={itemVariants}>
                  <div className="kpi-header">
                    <h3>Total Expense</h3>
                    <div className="kpi-icon" style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.1)' }}><ArrowDownRight size={20} /></div>
                  </div>
                  <h2 style={{ color: '#f43f5e', textShadow: '0 0 15px rgba(244,63,94,0.4)' }}>₹{expense.toLocaleString()}</h2>
                  <p className="kpi-subtext">Alert: Nearing budget limit</p>
                </motion.div>
              </motion.div>

              <motion.div className="content-grid" variants={containerVariants} initial="hidden" animate="visible">

                {/* EXPENSE CHART */}
                <motion.div className="chart-section glass-card" variants={itemVariants}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Income vs Expense Trends</h3>
                    <input
                      type="month"
                      className="glass-input"
                      style={{ width: 'auto', padding: '0.4rem', fontSize: '0.8rem' }}
                      value={chartMonth}
                      onChange={(e) => setChartMonth(e.target.value)}
                    />
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={expenseTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                        <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                        <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                        <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* RECENT TRANSACTIONS TABLE */}
                <motion.div className="transactions-section glass-card" variants={itemVariants}>
                  <h3>Recent Transactions</h3>
                  {recentTransactions.length === 0 ? (
                    <div className="empty-state">
                      <p>No transactions yet. Start tracking your expenses!</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="glass-table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th className="text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions.map(t => (
                            <tr key={t._id}>
                              <td>
                                <div className="td-category">
                                  <span className="cat-dot" style={{ background: t.type === 'income' ? '#10b981' : '#f43f5e' }}></span>
                                  {t.category || t.name || 'Uncategorized'}
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                                  {t.type}
                                </span>
                              </td>
                              <td style={{ color: '#94a3b8' }}>{new Date(t.date).toLocaleDateString()}</td>
                              <td className="text-right" style={{ fontWeight: '600', color: t.type === 'income' ? '#10b981' : '#f43f5e' }}>
                                {t.type === 'income' ? '+' : '-'}₹{t.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}

          {activeView === "transactions" && <Transactions />}
          {activeView === "budget" && <MonthlySetup />}
          {activeView === "loan" && <LoanOffers />}

        </main>

        {/* RIGHT SIDEBAR - AI LOAN SUGGESTIONS */}
        {activeView === "overview" && (
          <motion.aside className="right-sidebar glass-panel" initial={{ x: 250, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }}>

            <div className="credit-health glass-card">
              <h4>Credit Health</h4>

              {creditScore === null || isEditingScore ? (
                <form onSubmit={handleScoreSubmit} style={{ width: '100%', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    {creditScore === null ? "Add your credit score to see your health status." : "Update your current credit score."}
                  </p>
                  <input
                    type="number"
                    className="glass-input"
                    placeholder="e.g. 750"
                    value={tempScore}
                    onChange={(e) => setTempScore(e.target.value)}
                    style={{ marginBottom: '1rem', textAlign: 'center' }}
                  />
                  <button type="submit" className="glass-button" style={{ width: '100%' }}>
                    {creditScore === null ? "Submit Score" : "Update Score"}
                  </button>
                  {creditScore !== null && (
                    <button type="button" className="glass-button secondary" onClick={() => setIsEditingScore(false)} style={{ width: '100%', marginTop: '0.5rem' }}>
                      Cancel
                    </button>
                  )}
                </form>
              ) : (
                <>
                  <div className="score-ring">
                    <h2>{creditScore}</h2>
                    <p>
                      {creditScore >= 750 ? "Excellent" :
                        creditScore >= 700 ? "Good" :
                          creditScore >= 650 ? "Average" :
                            "Poor"}
                    </p>
                  </div>
                  <p className="health-detail" style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>
                    Based on your input, this is your credit score.
                  </p>
                  <button
                    className="glass-button secondary"
                    onClick={() => {
                      setTempScore(creditScore);
                      setIsEditingScore(true);
                    }}
                    style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
                  >
                    Update Credit Score
                  </button>
                </>
              )}
            </div>

            <h3 className="section-title">Financial Intelligence Report</h3>
            <div className="report-generator glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Start Date</label>
                  <input
                    type="date"
                    className="glass-input"
                    style={{ fontSize: '0.8rem' }}
                    value={reportRange.start}
                    onChange={(e) => setReportRange({ ...reportRange, start: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>End Date</label>
                  <input
                    type="date"
                    className="glass-input"
                    style={{ fontSize: '0.8rem' }}
                    value={reportRange.end}
                    onChange={(e) => setReportRange({ ...reportRange, end: e.target.value })}
                  />
                </div>
                <button className="glass-button" onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? "Analyzing..." : <><FileText size={16} style={{ marginRight: '8px' }} /> Generate Audit</>}
                </button>
              </div>
            </div>

            {reportData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="report-results glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Audit Summary</h4>
                    <button className="glass-button secondary" onClick={downloadPDF} style={{ padding: '0.5rem 1rem' }}>
                      <Download size={18} style={{ marginRight: '8px' }} /> PDF
                    </button>
                  </div>

                  {/* CHRONOLOGICAL SUMMARY PREVIEW */}
                  <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '5px' }}>
                    {reportData.reportData?.monthlyBreakdown?.map((m, i) => (
                      <div key={i} className="glass-card" style={{ padding: '0.8rem', marginBottom: '0.8rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 'bold' }}>{m.month}</span>
                          <span style={{ color: m.savings >= 0 ? '#10b981' : '#ef4444', fontSize: '0.8rem' }}>₹{m.expense} spent</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                            <div style={{ width: `${Math.min(100, (m.expense / m.income) * 100)}%`, height: '100%', background: m.expense > m.income ? '#ef4444' : '#6366f1', borderRadius: '2px' }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestions removed as requested */}
                </div>
              </motion.div>
            )}

          </motion.aside>
        )}

      </div>

      {/* FLOATING AI CHAT WIDGET */}
      <AIChat />

      {/* PREMIUM IN-APP TOAST */}
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          className="premium-toast"
          style={{
            position: 'fixed', bottom: '30px', right: '30px',
            zIndex: 1000, minWidth: '320px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '20px', padding: '1.2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99, 102, 241, 0.2)',
            display: 'flex', gap: '15px', alignItems: 'center'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
            width: '45px', height: '45px', borderRadius: '15px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}>
            <Zap color="white" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h5 style={{ margin: 0, color: 'white', fontSize: '0.95rem', fontWeight: 'bold' }}>{activeToast.title}</h5>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.4' }}>{activeToast.message}</p>
          </div>
          <button onClick={() => setActiveToast(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '5px' }}>✕</button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;