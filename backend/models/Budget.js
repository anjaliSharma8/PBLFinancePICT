const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  month: {
    type: String, // Format: YYYY-MM
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  expenses: [
    {
      category: String,
      amount: Number
    }
  ],
  totalExpense: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Budget", BudgetSchema);