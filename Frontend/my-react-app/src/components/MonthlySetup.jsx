import React, { useState, useEffect } from "react";
import AppNavbar from "./AppNavbar";

function MonthlySetup() {

  const [month, setMonth] = useState("");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([
    { category: "", amount: "" }
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Check if budget already exists when month changes
  useEffect(() => {
    if (!month) return;

    const checkExistingBudget = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/budget/${month}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (res.ok) {
          const data = await res.json();

          // Autofill existing budget
          setIncome(data.income);
          setExpenses(data.expenses);
          setMessage("⚠ Budget already exists for this month.");
        } else {
          // Clear if no budget found
          setIncome("");
          setExpenses([{ category: "", amount: "" }]);
          setMessage("");
        }

      } catch (err) {
        console.error(err);
      }
    };

    checkExistingBudget();

  }, [month]);



  const handleExpenseChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const addExpenseField = () => {
    setExpenses([...expenses, { category: "", amount: "" }]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const totalExpense = expenses.reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0
    );

    const data = {
      month,
      income: Number(income),
      expenses,
      totalExpense
    };

    try {
      const res = await fetch("http://localhost:8080/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage("❌ " + (result.message || "Error saving budget"));
      } else {
        setMessage("✅ Monthly Budget Saved Successfully!");
      }

    } catch (err) {
      console.error(err);
      setMessage("❌ Server Error");
    }

    setLoading(false);
  };


  return (
    <>
      <AppNavbar />

      <div style={{ padding: "40px" }}>
        <h2>Monthly Budget Setup</h2>

        {message && (
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Month */}
          <div>
            <label>Select Month</label><br />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          {/* Income */}
          <div style={{ marginTop: "20px" }}>
            <label>Monthly Income</label><br />
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />
          </div>

          {/* Expenses */}
          <div style={{ marginTop: "30px" }}>
            <h3>Expenses</h3>

            {expenses.map((exp, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <input
                  type="text"
                  placeholder="Category"
                  value={exp.category}
                  onChange={(e) =>
                    handleExpenseChange(index, "category", e.target.value)
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={exp.amount}
                  onChange={(e) =>
                    handleExpenseChange(index, "amount", e.target.value)
                  }
                  required
                />
              </div>
            ))}

            <button type="button" onClick={addExpenseField}>
              + Add More Category
            </button>
          </div>

          <br />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Budget"}
          </button>

        </form>
      </div>
    </>
  );
}

export default MonthlySetup;