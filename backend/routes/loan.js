const express = require("express");
const router = express.Router();

// ---------------- 50 BANKS DATA ----------------
const mockLoanDatabase = [
  { bank: "HDFC Bank", interestRate: 10.5, processingFee: 4999, maxTenure: 60, minScore: 720, instant: true },
  { bank: "SBI", interestRate: 11.15, processingFee: 0, maxTenure: 84, minScore: 750, instant: false },
  { bank: "ICICI Bank", interestRate: 10.75, processingFee: 2500, maxTenure: 72, minScore: 710, instant: true },
  { bank: "Axis Bank", interestRate: 10.49, processingFee: 3000, maxTenure: 60, minScore: 700, instant: false },
  { bank: "Kotak Mahindra", interestRate: 10.99, processingFee: 1500, maxTenure: 60, minScore: 680, instant: true },
  { bank: "Bajaj Finserv", interestRate: 11.0, processingFee: 1999, maxTenure: 60, minScore: 685, instant: true },
  { bank: "IDFC First", interestRate: 10.49, processingFee: 3499, maxTenure: 60, minScore: 715, instant: true },
  { bank: "IndusInd Bank", interestRate: 10.49, processingFee: 2500, maxTenure: 60, minScore: 700, instant: false },
  { bank: "Bank of Baroda", interestRate: 10.90, processingFee: 1000, maxTenure: 84, minScore: 730, instant: false },
  { bank: "PNB", interestRate: 11.40, processingFee: 0, maxTenure: 60, minScore: 740, instant: false },

  { bank: "Union Bank", interestRate: 11.2, processingFee: 1200, maxTenure: 60, minScore: 700, instant: false },
  { bank: "Canara Bank", interestRate: 10.95, processingFee: 900, maxTenure: 72, minScore: 710, instant: false },
  { bank: "Yes Bank", interestRate: 11.3, processingFee: 2000, maxTenure: 60, minScore: 690, instant: true },
  { bank: "Federal Bank", interestRate: 10.85, processingFee: 1500, maxTenure: 60, minScore: 705, instant: true },
  { bank: "RBL Bank", interestRate: 11.25, processingFee: 1800, maxTenure: 60, minScore: 690, instant: true },
  { bank: "HSBC Bank", interestRate: 10.7, processingFee: 2500, maxTenure: 60, minScore: 720, instant: true },
  { bank: "Standard Chartered", interestRate: 10.8, processingFee: 3000, maxTenure: 60, minScore: 725, instant: true },
  { bank: "UCO Bank", interestRate: 11.5, processingFee: 800, maxTenure: 60, minScore: 680, instant: false },
  { bank: "Indian Bank", interestRate: 11.1, processingFee: 700, maxTenure: 60, minScore: 700, instant: false },
  { bank: "Central Bank", interestRate: 11.6, processingFee: 600, maxTenure: 60, minScore: 670, instant: false },

  { bank: "Bandhan Bank", interestRate: 11.3, processingFee: 1200, maxTenure: 60, minScore: 680, instant: true },
  { bank: "AU Small Finance", interestRate: 11.4, processingFee: 1500, maxTenure: 60, minScore: 690, instant: true },
  { bank: "Equitas Bank", interestRate: 11.2, processingFee: 1300, maxTenure: 60, minScore: 685, instant: true },
  { bank: "Suryoday Bank", interestRate: 11.5, processingFee: 1000, maxTenure: 60, minScore: 670, instant: false },
  { bank: "ESAF Bank", interestRate: 11.6, processingFee: 900, maxTenure: 60, minScore: 660, instant: false },

  { bank: "Tata Capital", interestRate: 11.0, processingFee: 2000, maxTenure: 60, minScore: 700, instant: true },
  { bank: "Aditya Birla Finance", interestRate: 11.2, processingFee: 1800, maxTenure: 60, minScore: 690, instant: true },
  { bank: "L&T Finance", interestRate: 11.3, processingFee: 1700, maxTenure: 60, minScore: 695, instant: true },
  { bank: "Fullerton India", interestRate: 11.5, processingFee: 1600, maxTenure: 60, minScore: 680, instant: true },
  { bank: "Mahindra Finance", interestRate: 11.4, processingFee: 1500, maxTenure: 60, minScore: 685, instant: true },

  { bank: "MoneyTap", interestRate: 13.0, processingFee: 1000, maxTenure: 36, minScore: 650, instant: true },
  { bank: "KreditBee", interestRate: 14.0, processingFee: 800, maxTenure: 24, minScore: 600, instant: true },
  { bank: "CASHe", interestRate: 15.0, processingFee: 700, maxTenure: 18, minScore: 580, instant: true },
  { bank: "LazyPay", interestRate: 13.5, processingFee: 900, maxTenure: 24, minScore: 620, instant: true },
  { bank: "Navi Loans", interestRate: 12.5, processingFee: 1200, maxTenure: 36, minScore: 650, instant: true },

  { bank: "PaySense", interestRate: 13.2, processingFee: 1100, maxTenure: 36, minScore: 640, instant: true },
  { bank: "EarlySalary", interestRate: 14.2, processingFee: 900, maxTenure: 24, minScore: 620, instant: true },
  { bank: "ZestMoney", interestRate: 13.8, processingFee: 950, maxTenure: 36, minScore: 630, instant: true },
  { bank: "Home Credit", interestRate: 14.5, processingFee: 800, maxTenure: 24, minScore: 600, instant: true },
  { bank: "FlexSalary", interestRate: 13.7, processingFee: 850, maxTenure: 24, minScore: 610, instant: true },

  { bank: "InCred", interestRate: 12.8, processingFee: 1500, maxTenure: 60, minScore: 680, instant: true },
  { bank: "Clix Capital", interestRate: 12.9, processingFee: 1400, maxTenure: 60, minScore: 690, instant: true },
  { bank: "Indiabulls Finance", interestRate: 13.0, processingFee: 1600, maxTenure: 60, minScore: 670, instant: true },
  { bank: "Shriram Finance", interestRate: 13.5, processingFee: 1700, maxTenure: 60, minScore: 660, instant: true },
  { bank: "Muthoot Finance", interestRate: 13.8, processingFee: 1500, maxTenure: 60, minScore: 650, instant: true }
];

// ---------------- EMI ----------------
function calculateEMI(P, rate, months) {
  const r = rate / 12 / 100;
  return (P * r * Math.pow(1 + r, months)) /
         (Math.pow(1 + r, months) - 1);
}

// ---------------- ROUTE ----------------
router.post("/filter", (req, res) => {
  const { amount, income, creditScore } = req.body;

  try {
    const eligibleLoans = mockLoanDatabase
      .filter(l => creditScore >= l.minScore)
      .map(loan => {
        const tenure = Math.min(60, loan.maxTenure);
        const emi = calculateEMI(amount, loan.interestRate, tenure);

        const ratio = emi / income;
        let status = "Safe ✅";
        if (ratio > 0.6) status = "Risky ❌";
        else if (ratio > 0.4) status = "Moderate ⚠️";

        return { ...loan, emi: Math.round(emi), tenure, status };
      });

    const ranked = eligibleLoans
      .map(l => ({
        ...l,
        score:
          (100000 / l.emi) * 0.6 +
          (l.instant ? 30 : 0) +
          (1000 / (l.processingFee + 1)) * 0.2
      }))
      .sort((a, b) => b.score - a.score);

    const topLoans = ranked.slice(0, 5).map((l, i) => ({
      ...l,
      best: i === 0
    }));

    res.json({
      success: true,
      eligible: true,
      totalBanks: mockLoanDatabase.length,
      tableData: topLoans
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;