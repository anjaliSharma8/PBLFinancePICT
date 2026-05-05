import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, SlidersHorizontal, ArrowLeft } from "lucide-react";
import LoanCard from "./LoanCard";
import "./dashboard.css"; 

function LoanPage() {
  const [amount, setAmount] = useState(500000);
  const [cibil, setCibil] = useState(750);
  const [tenure, setTenure] = useState(60);
  const [type, setType] = useState("personal");

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ❤️ LOAD FROM LOCALSTORAGE */
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [sortType, setSortType] = useState("emi");

  const handleSubmit = async () => {
    setLoading(true);
    setLoans([]);
    try {
      // Small simulated delay for premium feel
      setTimeout(async () => {
        const res = await axios.post(
          "http://localhost:8080/api/loan/loan-suggestions",
          { amount, cibil, tenure, type }
        );
        setLoans(res.data);
        setLoading(false);
      }, 600);
    } catch (err) {
      alert("Error fetching loans");
      setLoading(false);
    }
  };

  /* ❤️ FAVORITE TOGGLE */
  const toggleFavorite = (loan) => {
    let updated;
    const exists = favorites.find((f) => f.bank === loan.bank && f.type === loan.type);
    if (exists) {
      updated = favorites.filter((f) => !(f.bank === loan.bank && f.type === loan.type));
    } else {
      updated = [...favorites, loan];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  /* 🔄 SORT */
  const sortedLoans = [...loans].sort((a, b) => {
    if (sortType === "emi") return a.emi - b.emi;
    if (sortType === "interest") return a.interestRate - b.interestRate;
    return 0;
  });

  return (
    <div className="dashboard-wrapper" style={{ flexDirection: "column", padding: "2rem", overflowY: "auto" }}>
      {/* Background Animated Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-3" style={{ bottom: "0", top: "auto" }}></div>

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", zIndex: 1, position: "relative" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <motion.button onClick={() => window.history.back()} className="glass-button secondary" style={{ padding: "0.5rem 1rem", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <ArrowLeft size={16} /> Back
            </motion.button>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", margin: "0", background: "linear-gradient(to right, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Filter Loan Offers
            </h1>
            <p style={{ color: "#94a3b8", margin: "0.5rem 0 0 0" }}>Adjust parameters to fetch your AI-tailored matches.</p>
          </div>
          
          <button onClick={() => window.location.href = "/favorites"} className="glass-button" style={{ background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.3)", color: "#f43f5e", display: "flex", alignItems: "center", gap: "8px" }}>
            ❤️ Favorites ({favorites.length})
          </button>
        </div>

        {/* PREMIUM FILTER BAR */}
        <motion.div className="glass-card" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "2rem" }} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="input-group" style={{ flex: "1 1 200px" }}>
            <label>Amount (₹)</label>
            <input type="number" className="glass-input" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="input-group" style={{ flex: "1 1 200px" }}>
            <label>CIBIL Score</label>
            <input type="number" className="glass-input" value={cibil} onChange={(e) => setCibil(e.target.value)} />
          </div>
          <div className="input-group" style={{ flex: "1 1 200px" }}>
            <label>Tenure (Months)</label>
            <input type="number" className="glass-input" value={tenure} onChange={(e) => setTenure(e.target.value)} />
          </div>
          <div className="input-group" style={{ flex: "1 1 200px" }}>
            <label>Loan Type</label>
            <select className="glass-input" value={type} onChange={(e) => setType(e.target.value)} style={{ appearance: "none", color: "#w" }}>
              <option value="personal" style={{background: "#0f172a"}}>Personal</option>
              <option value="home" style={{background: "#0f172a"}}>Home</option>
              <option value="car" style={{background: "#0f172a"}}>Car</option>
              <option value="two-wheeler" style={{background: "#0f172a"}}>Two Wheeler</option>
            </select>
          </div>
          <button className="glass-button" onClick={handleSubmit} disabled={loading} style={{ flex: "0 0 auto", height: "46px", display: "flex", alignItems: "center", gap: "8px" }}>
            {loading ? <div className="pulse" style={{width: 16, height: 16, borderRadius: "50%", background: "#fff"}}></div> : <FileSearch size={18} />}
            {loading ? "Scanning..." : "Get Matches"}
          </button>
        </motion.div>

        {/* RESULTS AREA */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#f8fafc", margin: 0 }}>Available Options</h2>
          {loans.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <SlidersHorizontal size={18} color="#94a3b8" />
              <select className="glass-input" style={{ width: "auto", padding: "0.5rem 1rem" }} value={sortType} onChange={(e) => setSortType(e.target.value)}>
                <option value="emi" style={{background: "#0f172a"}}>Sort by EMI</option>
                <option value="interest" style={{background: "#0f172a"}}>Sort by Interest</option>
              </select>
            </div>
          )}
        </div>

        <motion.div layout className="content-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem", display: "grid" }}>
          <AnimatePresence>
            {loading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "#a5b4fc" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}><FileSearch className="pulse" size={48} color="#6366f1" /></div>
                <h3>Cross-referencing bank rates...</h3>
              </motion.div>
            ) : loans.length > 0 ? (
              sortedLoans.map((loan, index) => (
                <LoanCard
                  key={`${loan.bank}-${loan.type}-${index}`}
                  loan={loan}
                  index={index}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Click "Get Matches" to pull the latest offers.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}

export default LoanPage;