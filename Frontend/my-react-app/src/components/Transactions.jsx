import React, { useEffect, useState, useCallback } from "react";
import AppNavbar from "./AppNavbar";

function Transactions() {
  const [groupedTransactions, setGroupedTransactions] = useState({});

  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    description: ""
  });

  // =============================
  // GROUP BY DATE
  // =============================
  const groupByDate = (data) => {
    const grouped = {};

    data.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString();

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(t);
    });

    setGroupedTransactions(grouped);
  };

  // =============================
  // FETCH TRANSACTIONS
  // =============================
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();
      groupByDate(data);

    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // =============================
  // ADD TRANSACTION
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            ...form,
            amount: Number(form.amount),
            type: "expense"
          })
        }
      );

      if (response.ok) {
        setForm({
          amount: "",
          category: "",
          date: "",
          description: ""
        });

        fetchTransactions();
      }

    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // =============================
  // DELETE TRANSACTION
  // =============================
  const handleDelete = async (id) => {
    try {
      await fetch(
        `http://localhost:8080/api/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      fetchTransactions();

    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <>
      <AppNavbar />

      <div style={{ padding: "30px", color: "white" }}>
        <h2 style={{ marginBottom: "20px" }}>Daily Expenses</h2>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "40px"
          }}
        >
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            required
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            required
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <input
            type="date"
            value={form.date}
            required
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button type="submit">Add Expense</button>
        </form>

        {/* ================= GROUPED VIEW ================= */}
        {Object.keys(groupedTransactions).length === 0 && (
          <p>No transactions yet</p>
        )}

        {Object.entries(groupedTransactions).map(
          ([date, items]) => {
            const dailyTotal = items.reduce(
              (sum, item) => sum + item.amount,
              0
            );

            return (
              <div key={date} style={dateSection}>
                <h3 style={{ marginBottom: "15px" }}>
                  📅 {date}
                </h3>

                {items.map((t) => (
                  <div key={t._id} style={transactionCard}>
                    <div>
                      <strong style={{ color: "#4da6ff" }}>
                        ₹{t.amount}
                      </strong>
                      <p>{t.category}</p>
                      {t.description && (
                        <small>{t.description}</small>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(t._id)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <div style={dailyTotalStyle}>
                  Total: ₹{dailyTotal}
                </div>
              </div>
            );
          }
        )}
      </div>
    </>
  );
}

// =============================
// STYLES
// =============================
const dateSection = {
  background: "#111",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "25px"
};

const transactionCard = {
  background: "#1a1a1a",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer",
  borderRadius: "6px"
};

const dailyTotalStyle = {
  marginTop: "10px",
  fontWeight: "bold",
  color: "#ff4d4d"
};

export default Transactions;