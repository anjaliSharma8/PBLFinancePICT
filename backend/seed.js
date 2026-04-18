const mongoose = require("mongoose");
require("dotenv").config();
const Loan = require("./models/Loan");
const data = require("./data/baseLoans.json");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Loan.deleteMany();
  await Loan.insertMany(data);

  console.log("Database seeded ✅");
  process.exit();
}

seed();