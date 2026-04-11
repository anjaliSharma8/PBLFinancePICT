import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.brand}>
        <span style={styles.logo}>✦</span> VaultCore Dashboard
      </Link>

      <div style={styles.navLinks}>
        <Link to="/transactions" style={styles.link}>Transactions</Link>
        
        {/* ✅ NEW LINK ADDED */}
        <Link to="/loan-offers" style={styles.link}>Loan Offers</Link>

        <Link to="/setup" style={styles.link}>Setup</Link>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logo: {
    color: "#6366f1",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    border: "1px solid #ef4444",
    color: "#ef4444",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s",
  }
};

export default AppNavbar;