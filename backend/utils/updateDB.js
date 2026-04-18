const Loan = require("../models/Loan");
const baseLoans = require("../data/baseLoans.json");
const mergeLoans = require("./mergeLoans");

async function updateDatabase(scraped, type) {
    const finalData = mergeLoans(baseLoans, scraped, type);

    await Loan.deleteMany({ type });

    await Loan.insertMany(finalData.filter(l => l.type === type));

    console.log(type + " updated");
}

module.exports = updateDatabase;