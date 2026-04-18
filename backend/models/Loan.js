const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
    bank: String,
    type: String,
    interestRate: Number,
    processingFee: Number,
    maxTenure: Number,
    minScore: Number,
     link: String,   
    lastUpdated: Date
});

module.exports = mongoose.model("Loan", LoanSchema);