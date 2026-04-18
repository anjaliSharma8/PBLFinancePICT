import React, { useEffect, useState } from "react";
import LoanCard from "./LoanCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

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

  return (
    <div className="app">
      <h1 className="title">❤️ Your Favorite Loans</h1>

      {favorites.length > 0 ? (
        <div className="results">
          {favorites.map((loan, index) => (
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
        <p className="no-data">No favorites saved yet</p>
      )}
    </div>
  );
}

export default Favorites;