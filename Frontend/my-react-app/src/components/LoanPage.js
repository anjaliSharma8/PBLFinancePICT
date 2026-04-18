import React, { useState } from "react";
import axios from "axios";
import LoanCard from "./LoanCard";

function LoanPage() {

  const [amount, setAmount] = useState(500000);
  const [cibil, setCibil] = useState(750);
  const [tenure, setTenure] = useState(60);
  const [type, setType] = useState("personal");

  const [loans, setLoans] = useState([]);

  /* ❤️ LOAD FROM LOCALSTORAGE */
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [sortType, setSortType] = useState("emi");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/loan/loan-suggestions",
        { amount, cibil, tenure, type }
      );
      setLoans(res.data);
    } catch (err) {
      alert("Error fetching loans");
    }
  };

  /* ❤️ FAVORITE TOGGLE */
  const toggleFavorite = (loan) => {
    let updated;

    const exists = favorites.find(
      (f) => f.bank === loan.bank && f.type === loan.type
    );

    if (exists) {
      updated = favorites.filter(
        (f) => !(f.bank === loan.bank && f.type === loan.type)
      );
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
    <div className="app">

      <h1 className="title">💸 Best Loan Offers</h1>

      {/* FORM */}
      <div className="form">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="number" value={cibil} onChange={(e) => setCibil(e.target.value)} />
        <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="personal">Personal</option>
          <option value="home">Home</option>
          <option value="car">Car</option>
          <option value="two-wheeler">Two Wheeler</option>
        </select>

        <button onClick={handleSubmit}>Get Loans</button>

        {/* ❤️ GO TO FAVORITES */}
        <button onClick={() => window.location.href = "/favorites"}>
          ❤️ Favorites
        </button>
      </div>

      {/* SORT */}
      {loans.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="emi">Sort by EMI</option>
            <option value="interest">Sort by Interest</option>
          </select>
        </div>
      )}

      {/* RESULTS */}
      {loans.length > 0 ? (
        <div className="results">
          {sortedLoans.map((loan, index) => (
            <LoanCard
              key={index}
              loan={loan}
              index={index}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <p className="no-data">No loans found</p>
      )}
    </div>
  );
}

export default LoanPage;