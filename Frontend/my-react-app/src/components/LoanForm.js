import React, { useState } from "react";
import axios from "axios";

function LoanForm({ setLoans }) {
  const [amount, setAmount] = useState(500000);
  const [cibil, setCibil] = useState(750);
  const [tenure, setTenure] = useState(60);
  const [type, setType] = useState("personal");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/loan/loan-suggestions",
        {
          amount,
          cibil,
          tenure,
          type,
        }
      );

      setLoans(res.data);

    } catch (err) {
      console.error(err);
      alert("❌ Backend not connected or wrong API");
    }
  };

  return (
    <div className="form">

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Loan Amount"
      />

      <input
        type="number"
        value={cibil}
        onChange={(e) => setCibil(e.target.value)}
        placeholder="CIBIL Score"
      />

      <input
        type="number"
        value={tenure}
        onChange={(e) => setTenure(e.target.value)}
        placeholder="Tenure (months)"
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="personal">Personal Loan</option>
        <option value="home">Home Loan</option>
        <option value="car">Car Loan</option>
        <option value="two-wheeler">Two Wheeler</option>
        <option value="education">Education Loan</option>
      </select>

      <button onClick={handleSubmit}>Get Loans</button>

    </div>
  );
}

export default LoanForm;