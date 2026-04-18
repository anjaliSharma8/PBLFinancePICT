const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");
const calculateEMI = require("../utils/emi");

router.post("/loan-suggestions", async (req, res) => {
    const { amount, cibil, tenure, type } = req.body;

    let loans = await Loan.find({ type });

// 🔥 fallback if no data
if (!loans || loans.length === 0) {
  console.log("No loans found for type, returning all");
  loans = await Loan.find();
}

    let result = loans
        .filter(l => cibil >= l.minScore)
        .map(l => {
            const emi = calculateEMI(amount, l.interestRate, tenure);

            return {
                bank: l.bank,
                interestRate: l.interestRate,
                emi: Math.round(emi),
                processingFee: l.processingFee,
                 link: l.link
            };
        })
        .sort((a, b) => a.emi - b.emi)
        .slice(0, 10);

    res.json(result);
});

module.exports = router;