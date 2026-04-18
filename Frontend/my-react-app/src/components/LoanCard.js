import React from "react";

function LoanCard({ loan, index, favorites, toggleFavorite }) {

  const isFav = favorites.some(
    (f) => f.bank === loan.bank && f.type === loan.type
  );

  const handleApply = () => {
    if (loan.link) {
      window.open(loan.link, "_blank");
    } else {
      alert("No link available");
    }
  };

  return (
    <div className={`card ${index === 0 ? "best" : ""}`}>

      {/* ❤️ FAVORITE */}
      <div
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={() => toggleFavorite(loan)}
      >
        ❤️
      </div>

      {/* BADGES */}
      {index === 0 && <div className="badge best">⭐ BEST</div>}
      {loan.processingFee < 2000 && (
        <div className="badge instant">⚡ INSTANT</div>
      )}

      {/* HEADER */}
      <div className="card-header">
        <h2>{loan.bank}</h2>
        <span className="rate">{loan.interestRate}%</span>
      </div>

      {/* DETAILS */}
      <p>EMI: ₹{loan.emi}</p>
      <p>Processing Fee: ₹{loan.processingFee}</p>

      {/* BUTTON */}
      <button className="apply-btn" onClick={handleApply}>
        Apply Now →
      </button>

    </div>
  );
}

export default LoanCard;