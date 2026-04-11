const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const verifyToken = require("../middleware/verifyToken");
const { getBudgetSuggestion } = require("../utils/genai");

// --- SAVE BUDGET ---
router.post("/", verifyToken, async (req, res) => {
  try {
    const { month, income, expenses } = req.body;
    if (!month || !income) return res.status(400).json({ message: "Month and income are required" });

    const expenseArray = Array.isArray(expenses) ? expenses : [];
    const totalExpense = expenseArray.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const existing = await Budget.findOne({ userId: req.user.id, month: month });
    if (existing) return res.status(400).json({ message: "Budget already exists for this month" });

    const newBudget = new Budget({ userId: req.user.id, month, income, expenses: expenseArray, totalExpense });
    await newBudget.save();
    res.status(201).json({ message: "Budget saved successfully" });

  } catch (error) {
    console.error("Budget Save Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- GET BUDGET ---
router.get("/:month", verifyToken, async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id, month: req.params.month });
    if (!budget) return res.status(404).json({ message: "No budget found" });
    res.json(budget);
  } catch (error) {
    console.error("Get Budget Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- AI BUDGET ANALYSIS ---
router.post("/analyze", verifyToken, async (req, res) => {
  try {
    const { income, totalBudget, totalSpent, categoryBreakdown } = req.body;
    const usagePercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const aiInsight = await getBudgetSuggestion({
      income, totalBudget, totalSpent, usagePercent, categoryBreakdown
    });

    res.json({ success: true, data: aiInsight });
  } catch (error) {
    console.error("AI Budget Analysis Error:", error);
    res.status(500).json({ success: false, error: "Failed to generate budget insights." });
  }
});

module.exports = router;