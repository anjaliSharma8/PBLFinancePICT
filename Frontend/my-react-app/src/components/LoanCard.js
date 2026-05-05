import React from "react";
import { motion } from "framer-motion";
import { Heart, Building2, Banknote, Percent, ExternalLink } from "lucide-react";
import "./dashboard.css"; // Reuse shared CSS

function LoanCard({ loan, index, favorites, toggleFavorite }) {
  const isFav = favorites.some((f) => f.bank === loan.bank && f.type === loan.type);
  const isBest = index === 0;

  const handleApply = () => {
    if (loan.link) window.open(loan.link, "_blank");
    else alert("No link available");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: isBest ? "0 10px 40px rgba(99, 102, 241, 0.4)" : "0 10px 40px rgba(0,0,0,0.4)" }}
      className={`glass-card ${isBest ? "best-match" : ""}`}
      style={{ 
        position: "relative", 
        padding: "1.5rem", 
        display: "flex", 
        flexDirection: "column",
        border: isBest ? "1px solid rgba(99, 102, 241, 0.5)" : undefined,
        background: isBest ? "rgba(30, 41, 59, 0.8)" : undefined
      }}
    >
      {/* BADGES & FAVORITE */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 }}>
          {isBest && (
            <div style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", padding: "4px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "bold", boxShadow: "0 0 10px rgba(99, 102, 241, 0.4)" }}>
              ⭐ BEST MATCH
            </div>
          )}
          {loan.processingFee < 2000 && (
            <div style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", padding: "4px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "bold" }}>
              ⚡ INSTANT
            </div>
          )}
        </div>
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={() => toggleFavorite(loan)}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 5, color: isFav ? "#f43f5e" : "#64748b" }}
        >
          <Heart size={22} fill={isFav ? "#f43f5e" : "transparent"} strokeWidth={isFav ? 0 : 2} />
        </motion.button>
      </div>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "1.5rem" }}>
        <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Building2 size={24} color="#38bdf8" />
        </div>
        <div>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 4px 0", color: "#f8fafc", lineHeight: 1.2 }}>{loan.bank}</h2>
          <span style={{ fontSize: "0.85rem", color: "#94a3b8", textTransform: "capitalize" }}>{loan.type} Loan</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", fontSize: "0.85rem", marginBottom: "4px" }}>
            <Percent size={14} /> Interest Rate
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>{loan.interestRate}%</div>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", fontSize: "0.85rem", marginBottom: "4px" }}>
            <Banknote size={14} /> Monthly EMI
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f8fafc" }}>₹{loan.emi}</div>
        </div>
      </div>

      <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>
        Processing Fee: <span style={{ color: "#cbd5e1" }}>₹{loan.processingFee}</span>
      </div>

      {/* ACTION BUTTON */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass-button" 
        onClick={handleApply}
        style={{ 
          marginTop: "auto", 
          width: "100%", 
          padding: "0.85rem", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: "8px",
          background: isBest ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : undefined,
          border: isBest ? "none" : undefined,
          fontWeight: 600
        }}
      >
        Proceed to Apply <ExternalLink size={16} />
      </motion.button>
    </motion.div>
  );
}

export default LoanCard;