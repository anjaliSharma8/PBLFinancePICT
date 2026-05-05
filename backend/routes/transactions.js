const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const verifyToken = require("../middleware/verifyToken");


// ============================
// ADD DAILY TRANSACTION
// ============================
router.post("/", verifyToken, async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;

    // 🔥 Extract month from expense date
    const expenseDate = new Date(date);
    const month = expenseDate.toISOString().slice(0, 7);

    // 🔥 Check if monthly budget exists
    const budget = await Budget.findOne({
      userId: req.user.id,
      month: month,
    });

    if (!budget) {
      return res.status(400).json({
        message: "Please setup monthly budget first."
      });
    }

    // 🔥 Save transaction
    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      type,
      category,
      date,
      description,
    });

    await newTransaction.save();
    
    // 🔥 REAL-TIME BUDGET ALERT CHECK
    const io = req.app.get("io");
    const allTxs = await Transaction.find({ 
        userId: req.user.id, 
        category: category, 
        type: "expense",
        date: { $gte: new Date(month + "-01") } 
    });
    const totalSpentInCat = allTxs.reduce((sum, t) => sum + t.amount, 0);

    if (budget) {
        // Find category with case-insensitive check
        const catBudget = budget.expenses.find(e => e.category.toLowerCase() === category.toLowerCase());
        
        console.log(`Checking budget for [${category}]:`);
        console.log(`- Total Spent this month: ₹${totalSpentInCat}`);
        console.log(`- Budget Limit: ₹${catBudget ? catBudget.amount : "NOT SET"}`);

        if (catBudget && totalSpentInCat > catBudget.amount) {
            console.log("🚨 BUDGET ALERT TRIGGERED! Sending to socket room:", req.user.id);
            io.to(req.user.id.toString()).emit("notification", {
                title: "Budget Exceeded! ⚠️",
                message: `You just spent ₹${amount} on ${category}. You've exceeded your ₹${catBudget.amount} budget for this category.`
            });
        } else {
            console.log("ℹ️ No alert sent (Spent <= Budget or No Category Budget found)");
        }
    } else {
        console.log("ℹ️ No budget found for this month in database.");
    }

    res.status(201).json({
      message: "Transaction Added Successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ============================
// GET ALL TRANSACTIONS
// ============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    }).sort({ date: -1 });

    res.json(transactions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ============================
// DELETE TRANSACTION
// ============================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;