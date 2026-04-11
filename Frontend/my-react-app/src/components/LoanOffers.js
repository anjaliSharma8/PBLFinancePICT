import React from "react";
import { useNavigate } from "react-router-dom";

const LoanOffers = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Smart Loan Advisor 💸</h1>
        <p style={styles.subtitle}>
          Get AI-powered loan recommendations based on your CIBIL score,
          income, and preferences.
        </p>

        <button
          onClick={() => navigate("/loan-form")}
          style={styles.button}
        >
          Get Personalized Loan →
        </button>
      </div>

      {/* FEATURES */}
      <div style={styles.features}>
        <div style={styles.card}>
          <h3>⚡ Instant Analysis</h3>
          <p>Analyze multiple banks in seconds</p>
        </div>

        <div style={styles.card}>
          <h3>📊 Smart EMI Calculation</h3>
          <p>Know your monthly payment before applying</p>
        </div>

        <div style={styles.card}>
          <h3>🤖 AI Recommendations</h3>
          <p>Get personalized loan suggestions</p>
        </div>
      </div>

      {/* INFO SECTION */}
      <div style={styles.info}>
        <h2>Why Use This?</h2>
        <p>
          Instead of checking each bank manually, our system compares offers
          and shows you the best loan options based on your profile.
        </p>
      </div>

    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    padding: "40px"
  },

  hero: {
    textAlign: "center",
    marginTop: "60px"
  },

  title: {
    fontSize: "2.8rem",
    marginBottom: "15px"
  },

  subtitle: {
    color: "#cbd5f5",
    maxWidth: "500px",
    margin: "0 auto 30px"
  },

  button: {
    padding: "14px 24px",
    background: "#6366f1",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s"
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "80px",
    flexWrap: "wrap"
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    width: "250px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },

  info: {
    marginTop: "80px",
    textAlign: "center",
    maxWidth: "600px",
    marginInline: "auto",
    color: "#cbd5f5"
  }
};

export default LoanOffers;