import React from "react";
import LoanCard from "./LoanCard";

function LoanResults({ loans }) {
  return (
    <div className="results">

      {loans.length === 0 ? (
        <h2 className="no-data">No loans found</h2>
      ) : (
        loans.map((loan, index) => (
          <LoanCard key={index} loan={loan} index={index} />
        ))
      )}

    </div>
  );
}

export default LoanResults;