const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes = require("./routes/budget");
const loanRoutes = require("./routes/loan");

// 🔥 NEW IMPORTS
const scrapeLoans = require("./utils/scraper");
const updateDatabase = require("./utils/updateDB");
const cron = require("node-cron");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/loan", loanRoutes);

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.log);

// 🔥 ALL LOAN TYPES
const LOAN_TYPES = [
  "personal",
  "home",
  "car",
  "two-wheeler",
  "used-car",
  "education",
  "gold"
];

// 🔥 CRON JOB (AUTO UPDATE DAILY)
cron.schedule("0 0 * * *", async () => {
  console.log("Running loan data update...");

  for (let type of LOAN_TYPES) {
    try {
      const scraped = await scrapeLoans(type);
      await updateDatabase(scraped, type);
    } catch (err) {
      console.log(`Error updating ${type}:`, err.message);
    }
  }

  console.log("Loan data update completed");
});

// 🔥 OPTIONAL: RUN ON SERVER START (VERY USEFUL)
(async () => {
  console.log("Initial loan data setup...");

  for (let type of LOAN_TYPES) {
    const scraped = await scrapeLoans(type);
    await updateDatabase(scraped, type);
  }

  console.log("Initial data loaded");
})();

// SERVER
app.listen(8080, () => {
  console.log("Server running on port 8080");
});