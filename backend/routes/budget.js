const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const verifyToken = require("../middleware/verifyToken");


// ==========================================
// 🔹 SAVE MONTHLY BUDGET
// ==========================================
router.post("/", verifyToken, async (req, res) => {
  try {
    const { month, income, expenses } = req.body;

    if (!month || !income) {
      return res.status(400).json({
        message: "Month and income are required"
      });
    }

    // Make sure expenses is array
    const expenseArray = Array.isArray(expenses) ? expenses : [];

    const totalExpense = expenseArray.reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0
    );

    // Check duplicate month
    const existing = await Budget.findOne({
      userId: req.user.id,
      month: month
    });

    if (existing) {
      return res.status(400).json({
        message: "Budget already exists for this month"
      });
    }

    const newBudget = new Budget({
      userId: req.user.id,
      month,
      income,
      expenses: expenseArray,
      totalExpense
    });

    await newBudget.save();

    res.status(201).json({
      message: "Budget saved successfully"
    });

  } catch (error) {
    console.error("Budget Save Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ==========================================
// 🔹 GET BUDGET BY MONTH
// ==========================================
router.get("/:month", verifyToken, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      userId: req.user.id,
      month: req.params.month
    });

    if (!budget) {
      return res.status(404).json({
        message: "No budget found"
      });
    }

    res.json(budget);

  } catch (error) {
    console.error("Get Budget Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;