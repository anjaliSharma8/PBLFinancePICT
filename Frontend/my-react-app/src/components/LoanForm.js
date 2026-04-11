import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const LoanForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    income: '',
    employmentType: 'Salaried',
    creditScore: ''
  });

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ VALIDATION FUNCTION
  const validateForm = () => {
    const { amount, income, creditScore } = formData;

    if (amount < 1000) return "Loan amount must be at least ₹1000";
    if (income < 5000) return "Income too low for loan eligibility";
    if (creditScore < 300 || creditScore > 900) return "CIBIL must be between 300–900";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/loan/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          income: Number(formData.income),
          creditScore: Number(formData.creditScore)
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || data.message || "Failed to fetch offers");
        return;
      }

      navigate('/loan-results', {
        state: { resultData: data, userData: formData }
      });

    } catch (err) {
      console.error(err);
      setError("Network error. Backend not reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ color: 'white', padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Loan Application</h2>

      {/* ✅ ERROR MESSAGE UI */}
      {error && (
        <div style={{
          background: '#7f1d1d',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          color: '#fecaca'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <input
          type="number"
          name="amount"
          placeholder="Loan Amount (₹)"
          min="1000"
          value={formData.amount}
          onChange={handleChange}
          disabled={loading}
          required
          style={styles.input}
        />

        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          disabled={loading}
          required
          style={styles.input}
        >
          <option value="">Select Purpose</option>
          <option value="Medical">Medical Emergency</option>
          <option value="Home Renovation">Home Renovation</option>
          <option value="Marriage">Marriage</option>
          <option value="Debt Consolidation">Debt Consolidation</option>
        </select>

        <input
          type="number"
          name="income"
          placeholder="Monthly Income (₹)"
          min="5000"
          value={formData.income}
          onChange={handleChange}
          disabled={loading}
          required
          style={styles.input}
        />

        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          disabled={loading}
          style={styles.input}
        >
          <option value="Salaried">Salaried</option>
          <option value="Self-Employed">Self-Employed</option>
        </select>

        <input
          type="number"
          name="creditScore"
          placeholder="CIBIL Score (300-900)"
          min="300"
          max="900"
          value={formData.creditScore}
          onChange={handleChange}
          disabled={loading}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Analyzing Offers..." : "Analyze Offers"}
        </button>

      </form>
    </div>
  );
};

const styles = {
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  button: {
    padding: '12px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default LoanForm;