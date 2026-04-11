import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoanResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultData, userData } = location.state || {};

  // 🔥 FILTER STATES
  const [maxInterest, setMaxInterest] = useState(20);
  const [maxEMI, setMaxEMI] = useState(100000);
  const [instantOnly, setInstantOnly] = useState(false);
  const [sortType, setSortType] = useState("");

  if (!resultData) {
    return (
      <div style={{ color: "white", padding: "40px" }}>
        No data found
        <br />
        <button onClick={() => navigate('/loan-form')}>Go Back</button>
      </div>
    );
  }

  if (!resultData.eligible) {
    return (
      <div style={{ color: "white", padding: "40px" }}>
        <h2>No offers available</h2>
        <button onClick={() => navigate('/loan-form')}>Go Back</button>
      </div>
    );
  }

  let loans = [...resultData.tableData];

  // 🔥 FILTER LOGIC
  loans = loans.filter(loan =>
    loan.interestRate <= maxInterest &&
    loan.emi <= maxEMI &&
    (!instantOnly || loan.instant)
  );

  // 🔥 SORT LOGIC
  if (sortType === "emi") {
    loans.sort((a, b) => a.emi - b.emi);
  } else if (sortType === "interest") {
    loans.sort((a, b) => a.interestRate - b.interestRate);
  }

  return (
    <div style={{ color: "white", padding: "40px" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Loan Offers</h1>
        <button onClick={() => navigate('/loan-form')}>Modify</button>
      </div>

      <p>
        CIBIL: <b>{userData?.creditScore}</b> | Amount: ₹{userData?.amount}
      </p>

      {/* 🔥 FILTER PANEL */}
      <div style={{
        background: "#1e1e2f",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "30px"
      }}>
        <h3>Filter & Sort</h3>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          
          <div>
            <label>Max Interest (%)</label><br />
            <input
              type="number"
              value={maxInterest}
              onChange={(e) => setMaxInterest(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Max EMI (₹)</label><br />
            <input
              type="number"
              value={maxEMI}
              onChange={(e) => setMaxEMI(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Sort By</label><br />
            <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="">None</option>
              <option value="emi">Lowest EMI</option>
              <option value="interest">Lowest Interest</option>
            </select>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label>
              <input
                type="checkbox"
                checked={instantOnly}
                onChange={() => setInstantOnly(!instantOnly)}
              />
              Instant Only
            </label>
          </div>

          {/* 🔥 RESET BUTTON */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={() => {
              setMaxInterest(20);
              setMaxEMI(100000);
              setInstantOnly(false);
              setSortType("");
            }}>
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* ❌ EMPTY RESULT */}
      {loans.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h2>No loans match your filters ❌</h2>
          <p>Try increasing interest or EMI limits</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          
          {loans.map((loan, index) => (
            <div key={index} style={{
              background: "#1a1a2e",
              padding: "20px",
              borderRadius: "10px",
              width: "280px",
              border: loan.best ? "2px solid #4ade80" : "1px solid #333"
            }}>

              {/* TAGS */}
              <div style={{ display: "flex", gap: "10px" }}>
                {loan.best && <span style={{ color: "#4ade80" }}>⭐ BEST</span>}
                {loan.instant && <span style={{ color: "#facc15" }}>⚡ INSTANT</span>}
              </div>

              <h2>{loan.bank}</h2>

              <p>Interest: {loan.interestRate}%</p>
              <p>EMI: ₹{loan.emi}</p>
              <p>Fee: ₹{loan.processingFee}</p>
              <p>Tenure: {loan.tenure} months</p>

              <p style={{
                color:
                  loan.status.includes("Safe") ? "#4ade80" :
                  loan.status.includes("Moderate") ? "#facc15" :
                  "#ef4444"
              }}>
                {loan.status}
              </p>

              <a href={loan.url} target="_blank" rel="noreferrer" style={{
                display: "block",
                marginTop: "10px",
                background: "#6366f1",
                padding: "10px",
                textAlign: "center",
                borderRadius: "6px",
                color: "white"
              }}>
                Apply Now ↗
              </a>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default LoanResults;