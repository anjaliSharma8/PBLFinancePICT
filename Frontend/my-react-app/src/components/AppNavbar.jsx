import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div style={{
      background: "#111",
      padding: "15px",
      color: "white"
    }}>
      <Link to="/dashboard" style={{ marginRight: "20px", color: "white" }}>
        Dashboard
      </Link>

      <Link to="/transactions" style={{ marginRight: "20px", color: "white" }}>
        Transactions
      </Link>

      <Link to="/setup" style={{ marginRight: "20px", color: "white" }}>
       setup
      </Link>

      <button
        onClick={handleLogout}
        style={{ float: "right", background: "red", color: "white" }}
      >
        Logout
      </button>
    </div>
  );
}

export default AppNavbar;