import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Wallet, CreditCard, PieChart, TrendingUp, CheckCircle, ArrowUpRight, ArrowDownRight, IndianRupee, Bell
} from 'lucide-react';
import './dashboard.css';
import Transactions from './Transactions';
import MonthlySetup from './MonthlySetup';
import AIChat from './AIChat';
import LoanOffers from './LoanOffers';



const Dashboard = () => {
  const [creditScore, setCreditScore] = useState(600);
  const [activeView, setActiveView] = useState("overview");
  const [loans, setLoans] = useState([]);

  // State for original functionality
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("User");
  
  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [budgetIncome, setBudgetIncome] = useState(0);

  useEffect(() => {
    // Attempt to load user name
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserName(JSON.parse(storedUser).name || "User");
      } catch (e) { console.error("Error parsing user"); }
    }
    
    // Auto-refresh data when returning to the Overview tab
    if (activeView === 'overview') {
      fetchTransactions();
      fetchBudget();
      fetchAlerts();
    }
  }, [activeView]);
  
   useEffect(() => {
    fetch("http://localhost:8080ers/api/loan/loan-suggestions")
      .then(res => res.json())
      .then(data => setLoans(data))
      .catch(err => console.log(err));
  }, []);

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
        try { userId = JSON.parse(storedUser).id; } catch(e) {}
      }
      const res = await fetch(`http://127.0.0.1:5000/api/alerts?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch(err) {
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
  if (income === 0) return;

  let score = 600;

  const savings = income - expense;
  const savingsRatio = savings / income;

  if (savingsRatio > 0.4) score += 100;
  else if (savingsRatio > 0.2) score += 70;
  else if (savingsRatio > 0.1) score += 40;
  else score -= 20;

  if (expense > income * 0.8) score -= 50;

  if (income > 30000) score += 50;
  if (income > 70000) score += 50;

  score = Math.max(300, Math.min(850, score));

  setCreditScore(Math.round(score));

}, [income, expense])

   
  const balance = budgetIncome - expense;
  const recentTransactions = transactions.slice(0, 5);

  // --- DYNAMIC CHART DATA ---
  const expenseTrendData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Create last 7 days array
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      data.push({
        dateFull: dateString,
        day: dayName,
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
  }, [transactions]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
  };
const topLoans = [...loans]
  .sort((a, b) => a.interest - b.interest)
  .slice(0, 2);
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
            <span className="brand-logo" style={{fontSize: '2rem'}}>✦</span>
            <div>
              <h2>VaultCore</h2>
              <p>PERSONAL FINANCE</p>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <a href="#" className={`nav-item ${activeView === 'overview' ? 'active' : ''}`} onClick={(e)=>{e.preventDefault(); setActiveView('overview');}}><LayoutDashboard size={20} /> Overview</a>
            <a href="#" className={`nav-item ${activeView === 'transactions' ? 'active' : ''}`} onClick={(e)=>{e.preventDefault(); setActiveView('transactions');}}><Wallet size={20} /> Transactions</a>
            <a href="#" className="nav-item"><TrendingUp size={20} /> Expense Trends</a>
           <a 
          href="#" 
            className={`nav-item ${activeView === 'loan' ? 'active' : ''}`} 
               onClick={(e)=>{e.preventDefault(); setActiveView('loan');}}
   >
  <CreditCard size={20} /> Loan Offers
</a>
            <a href="#" className={`nav-item ${activeView === 'budget' ? 'active' : ''}`} onClick={(e)=>{e.preventDefault(); setActiveView('budget');}}><PieChart size={20} /> Budget Setup</a>
            
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
                      {alerts.length === 0 ? <p style={{color: '#94a3b8', fontSize: '0.85rem'}}>Running analysis... nothing to report.</p> : (
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
                <div className="kpi-icon" style={{color: '#38bdf8', background: 'rgba(56,189,248,0.1)'}}><Wallet size={20}/></div>
              </div>
              <h2 style={{ color: '#38bdf8', textShadow: '0 0 15px rgba(56,189,248,0.4)' }}>₹{balance.toLocaleString()}</h2>
              <p className="kpi-subtext">Available in all accounts</p>
            </motion.div>

            <motion.div className="kpi-card glass-card" variants={itemVariants}>
              <div className="kpi-header">
                <h3>Total Budget</h3>
                <div className="kpi-icon" style={{color: '#10b981', background: 'rgba(16,185,129,0.1)'}}><ArrowUpRight size={20}/></div>
              </div>
              <h2 style={{ color: '#10b981', textShadow: '0 0 15px rgba(16,185,129,0.4)' }}>₹{income.toLocaleString()}</h2>
              <p className="kpi-subtext">+12% from last month</p>
            </motion.div>

            <motion.div className="kpi-card glass-card" variants={itemVariants}>
              <div className="kpi-header">
                <h3>Total Expense</h3>
                <div className="kpi-icon" style={{color: '#f43f5e', background: 'rgba(244,63,94,0.1)'}}><ArrowDownRight size={20}/></div>
              </div>
              <h2 style={{ color: '#f43f5e', textShadow: '0 0 15px rgba(244,63,94,0.4)' }}>₹{expense.toLocaleString()}</h2>
              <p className="kpi-subtext">Alert: Nearing budget limit</p>
            </motion.div>
          </motion.div>

          <motion.div className="content-grid" variants={containerVariants} initial="hidden" animate="visible">
            
            {/* EXPENSE CHART */}
            <motion.div className="chart-section glass-card" variants={itemVariants}>
              <h3>Income vs Expense Trends</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={expenseTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip contentStyle={{background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}} />
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
                              <span className="cat-dot" style={{background: t.type === 'income' ? '#10b981' : '#f43f5e'}}></span>
                              {t.category || t.name || 'Uncategorized'}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                              {t.type}
                            </span>
                          </td>
                          <td style={{color: '#94a3b8'}}>{new Date(t.date).toLocaleDateString()}</td>
                          <td className="text-right" style={{fontWeight: '600', color: t.type === 'income' ? '#10b981' : '#f43f5e'}}>
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
              <div className="score-ring">
                <h2>{creditScore}</h2>

<p>
  {creditScore >= 750 ? "Excellent" :
   creditScore >= 700 ? "Good" :
   creditScore >= 650 ? "Average" :
   "Poor"}
</p>
              </div>
              <p className="health-detail">Your stable income makes you highly eligible for top-tier loan rates.</p>
            </div>

            <h3 className="section-title">AI Loan Matches</h3>
            
           
             <div className="loan-cards">
  {topLoans.length === 0 ? (
    <p style={{ color: "#94a3b8" }}>Loading loans...</p>
  ) : (
    topLoans.map((loan, index) => (
      <div key={index} className="loan-match-card">
        
        <div className="loan-header">
          <div>
            <h4>{loan.bank}</h4>
            <p>{loan.type}</p>
          </div>

          {/* SAME BADGE STYLE */}
          {index === 0 && (
            <div className="loan-badge">Pre-approved</div>
          )}
        </div>

        <div className="loan-details">
          <div className="loan-stat">
            <span>Amount</span>
            <strong>{loan.amount}</strong>
          </div>
          <div className="loan-stat">
            <span>Interest</span>
            <strong>{loan.interest}% p.a</strong>
          </div>
        </div>

        <button
          className={`apply-btn ${index === 1 ? "outline" : ""}`}
          onClick={() => window.open(loan.link, "_blank")}
        >
          {index === 0 ? "View Details" : "Apply Now"}
        </button>

      </div>
    ))
  )}
</div>
             
           

          </motion.aside>
        )}

      </div>
      
      {/* FLOATING AI CHAT WIDGET */}
      <AIChat />
    </div>
  );
};

export default Dashboard;