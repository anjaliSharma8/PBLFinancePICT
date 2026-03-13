import React from "react";
import { motion } from "framer-motion";
import { 
  FiTrendingUp, FiCpu, FiShield, FiCheckCircle, 
  FiArrowRight, FiStar, FiGlobe, FiPieChart
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Home = () => {
  // Base animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  // Floating animation for decorative background elements
  const floatingAnimation = {
    y: ["-10%", "10%"],
    transition: {
      y: {
        duration: 3,
        yoyo: Infinity,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="home-page relative">
      
      {/* DECORATIVE BACKGROUND BLOBS */}
      <motion.div animate={floatingAnimation} className="blob blob-1"></motion.div>
      <motion.div animate={floatingAnimation} className="blob blob-2" style={{ animationDelay: "2s" }}></motion.div>

      {/* HERO SECTION */}
      <section className="hero">
        <motion.div 
          className="hero-container"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="tag-wrapper" variants={fadeInUp}>
            <span className="tag">Introducing ExpenseAI 2.0 ✨</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp}>
            Financial infrastructure <br />
            <span className="text-gradient">for modern users</span>
          </motion.h1>
          
          <motion.p className="subtitle" variants={fadeInUp}>
            Track expenses, monitor spending patterns, and get intelligent loan recommendations powered by cutting-edge AI.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeInUp}>
            <Link to="/register"><button className="btn-primary large">Get Started for Free <FiArrowRight className="inline-icon" /></button></Link>
            <button className="btn-secondary large">View Demo</button>
          </motion.div>

          {/* FLOATING DASHBOARD IMAGE */}
          <motion.div 
            className="hero-dashboard-preview"
            variants={fadeInUp}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                alt="ExpenseAI Dashboard Preview" 
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* TRUSTED BY SECTION */}
      <section className="trusted-by">
        <p>TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
        <div className="logo-ticker">
          <span className="brand">Acme Corp</span>
          <span className="brand">GlobalBank</span>
          <span className="brand">FinTech AI</span>
          <span className="brand">Stark Ind.</span>
          <span className="brand">Nexus</span>
        </div>
      </section>

      {/* PRODUCT SHOWCASE / HOW IT WORKS */}
      <section className="showcase">
        <div className="showcase-container">
          <motion.div 
            className="showcase-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp}>Total visibility over your cash flow.</motion.h2>
            <motion.p variants={fadeInUp}>Connect your bank accounts securely and let our AI categorize every penny. Stop guessing where your money goes.</motion.p>
            <motion.ul variants={fadeInUp} className="feature-list">
              <li><FiCheckCircle className="check-icon" /> Real-time sync with 10,000+ banks</li>
              <li><FiCheckCircle className="check-icon" /> Auto-categorization with 99% accuracy</li>
              <li><FiCheckCircle className="check-icon" /> Custom budgeting rules and alerts</li>
            </motion.ul>
          </motion.div>
          
          {/* ANIMATED SVG SHOWCASE PANEL */}
          <motion.div 
            className="showcase-visual"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-panel" style={{ position: "relative", overflow: "hidden" }}>
              <FiPieChart className="giant-icon" />
              <h3>Live Analytics</h3>
              <p>Your data, updated to the second.</p>

              {/* Animated Data Rings */}
              <motion.svg 
                width="200" 
                height="200" 
                viewBox="0 0 200 200" 
                style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.2, zIndex: -1 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="100" cy="100" r="80" stroke="#6366f1" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                <circle cx="100" cy="100" r="60" stroke="#ec4899" strokeWidth="2" fill="none" strokeDasharray="5 15" />
              </motion.svg>

              {/* Pulsing AI Node */}
              <motion.div 
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section className="features">
        <motion.div 
          className="features-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <h2>Everything you need to scale</h2>
          <p>We handle the complex math so you can focus on growing your wealth.</p>
        </motion.div>

        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="feature-card" variants={fadeInUp} whileHover={{ y: -10 }}>
            <div className="feature-icon"><FiTrendingUp /></div>
            <h3>Smart Tracking</h3>
            <p>Automatically categorize your daily expenses and visualize your cash flow in real-time.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp} whileHover={{ y: -10 }}>
            <div className="feature-icon"><FiCpu /></div>
            <h3>AI Loan Predictions</h3>
            <p>Our machine learning models analyze your history to predict loan approval odds with 98% accuracy.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp} whileHover={{ y: -10 }}>
            <div className="feature-icon"><FiShield /></div>
            <h3>Bank-Grade Security</h3>
            <p>Your financial data is encrypted at rest and in transit. We never sell your personal information.</p>
          </motion.div>
          
          <motion.div className="feature-card" variants={fadeInUp} whileHover={{ y: -10 }}>
            <div className="feature-icon"><FiGlobe /></div>
            <h3>Multi-Currency</h3>
            <p>Travel often? We support over 150 fiat and cryptocurrencies natively in your dashboard.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials">
        <motion.h2 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
        >
          Loved by thousands of creators
        </motion.h2>
        <div className="testimonial-grid">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: item * 0.1 }}
            >
              <div className="stars">
                <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
              </div>
              <p>"ExpenseAI completely changed how I run my freelance business. The loan predictor actually helped me secure funding for my new studio."</p>
              <div className="user-info">
                <div className="user-avatar"></div>
                <div>
                  <h4>Sarah Jenkins</h4>
                  <span>Freelance Designer</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <motion.div 
          className="cta-box"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <div className="cta-content">
            <h2>Ready to take control of your finances?</h2>
            <p>Join over 10,000 users optimizing their wealth with AI.</p>
            <Link to="/register"><button className="btn-primary large">Create an Account</button></Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;