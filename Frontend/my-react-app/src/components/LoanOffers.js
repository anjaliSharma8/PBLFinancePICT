import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CreditCard, ArrowRight, ShieldCheck, Banknote, Search, SlidersHorizontal, Percent, TrendingUp, Sparkles, MessageSquare } from "lucide-react";
import axios from "axios";
import "./dashboard.css";

const LoanOffers = () => {
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(60);
  const [cibil, setCibil] = useState(750);
  const [type, setType] = useState("personal");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("welcome"); // welcome, filter, results



  const fetchMatches = async () => {
    setLoading(true);
    try {
      // Simulate deep AI processing
      await new Promise(r => setTimeout(r, 800));
      const res = await axios.post("http://localhost:8080/api/loan/loan-suggestions", {
        amount, cibil, tenure, type
      });
      setLoans(res.data);
      setStep("results");
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="loan-advisor-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
      
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}
          >
            {/* AI ENERGY CORE (Inspired by Red Bull ChatBot Design) */}
            <motion.div 
              style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Outer Pulsing Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 1,
                    ease: "easeInOut" 
                  }}
                  style={{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%', 
                    border: '2px solid rgba(99, 102, 241, 0.3)', 
                    borderRadius: '50%' 
                  }}
                />
              ))}

              {/* Rotating Orbital Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', width: '140%', height: '140%', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', width: '120%', height: '120%', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}
              />

              {/* Central Energy Sphere */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 40px rgba(99, 102, 241, 0.5)', 
                    '0 0 80px rgba(168, 85, 247, 0.8)', 
                    '0 0 40px rgba(99, 102, 241, 0.5)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'radial-gradient(circle at 30% 30%, #fff, #6366f1, #a855f7)', 
                  borderRadius: '50%', 
                  zIndex: 2,
                  position: 'relative',
                  border: '4px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {/* Inner Detail */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', filter: 'blur(5px)' }}></div>
              </motion.div>

              {/* Message Bubble Overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{ position: 'absolute', bottom: '-20px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}
              >
                AI Thinking...
              </motion.div>
            </motion.div>

            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 16px 0', letterSpacing: '-2px', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ready to find your match?
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '500px', marginBottom: '40px', lineHeight: '1.6' }}>
              I've been analyzing your financial profile and I've found some potential loan opportunities that could save you thousands in interest.
            </p>

            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("filter")}
              className="glass-button"
              style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              Get Loan Advisory <Sparkles size={20} />
            </motion.button>
          </motion.div>
        )}

        {step !== "welcome" && (
          <motion.div 
            key="advisor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* HEADER SECTION */}
            <header style={{ marginBottom: '40px', textAlign: 'center', position: 'relative' }}>
              <button 
                onClick={() => setStep("welcome")}
                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
              >
                <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back
              </button>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 14px', borderRadius: '100px', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: '700', marginBottom: '16px' }}>
                <Zap size={14} fill="#38bdf8" /> PREMIUM AI MATCHING
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-1.5px', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart Loan Advisor</h1>
            </header>

            <div style={{ maxWidth: '800px', margin: '0 auto 40px auto' }}>
              {/* FILTERS & SEARCH */}
              <motion.div variants={itemVariants} className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <Search size={20} color="#6366f1" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Configure Requirements</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="input-group">
                    <label>Required Amount (₹)</label>
                    <input type="number" className="glass-input" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>Loan Type</label>
                    <select className="glass-input" value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="personal">Personal</option>
                      <option value="home">Home</option>
                      <option value="car">Car</option>
                      <option value="education">Education</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Tenure (Months)</label>
                    <input type="number" className="glass-input" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>CIBIL Score</label>
                    <input type="number" className="glass-input" value={cibil} onChange={(e) => setCibil(Number(e.target.value))} />
                  </div>
                </div>

                <button 
                  className="glass-button" 
                  style={{ width: '100%', marginTop: '32px', height: '54px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  onClick={fetchMatches}
                  disabled={loading}
                >
                  {loading ? <span className="pulse" style={{ width: 12, height: 12, background: '#fff', borderRadius: '50%' }}></span> : <Zap size={20} />}
                  {loading ? 'Analyzing Market Rates...' : 'Get Best AI Matches'}
                </button>
              </motion.div>
            </div>

            {/* RESULTS GRID */}
            <AnimatePresence>
              {loans.length > 0 && step === "results" && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  variants={containerVariants}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 10px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Top Matches for You</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#94a3b8' }}>
                      <SlidersHorizontal size={16} /> Sort by Relevance
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '24px', scrollSnapType: 'x mandatory' }} className="horizontal-scroll">
                    {loans.map((loan, idx) => (
                      <motion.div 
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.01 }}
                        className="glass-card"
                        style={{ minWidth: '340px', maxWidth: '380px', scrollSnapAlign: 'start', padding: '24px', border: idx === 0 ? '1px solid rgba(99, 102, 241, 0.4)' : undefined, background: idx === 0 ? 'rgba(99, 102, 241, 0.05)' : undefined, flexShrink: 0 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Banknote size={24} color="#38bdf8" />
                          </div>
                          {idx === 0 && (
                            <div style={{ background: '#6366f1', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800', boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}>
                              BEST MATCH
                            </div>
                          )}
                        </div>

                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: '700' }}>{loan.bank}</h3>
                        <p style={{ margin: '0 0 20px 0', color: '#94a3b8', fontSize: '0.85rem' }}>{loan.type} Loan Opportunity</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Interest</span>
                            <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>{loan.interestRate}%</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Approx EMI</span>
                            <strong style={{ fontSize: '1.2rem' }}>₹{loan.emi}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '24px', padding: '0 4px' }}>
                          <span>Processing: ₹{loan.processingFee}</span>
                          <span>No Hard Inquiry</span>
                        </div>

                        <button className="glass-button" style={{ width: '100%', padding: '12px' }} onClick={() => window.open(loan.link, '_blank')}>
                          Proceed to Apply
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loans.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}
              >
                <div style={{ width: 60, height: 60, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <ShieldCheck size={30} color="#6366f1" />
                </div>
                <h3 style={{ color: '#f1f5f9' }}>Ready for Analysis</h3>
                <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>Click "Get Best AI Matches" to cross-reference your profile with current market lending rates.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default LoanOffers;