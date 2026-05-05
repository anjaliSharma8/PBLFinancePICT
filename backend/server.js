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
const User = require("./models/User");
const Transaction = require("./models/Transaction");

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
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket logic
io.on("connection", (socket) => {
  console.log("New client connected to Socket.io");
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined notification room ${userId}`);
    // Emit a test greeting back to the user
    socket.emit("notification", {
      title: "Socket Connected! ✅",
      message: "Real-time notifications are now active."
    });
  });
});

// Attach io to app to use in routes
app.set("io", io);

// 🔥 DAILY REMINDER CRON (8 PM EVERY DAY)
cron.schedule("0 20 * * *", async () => {
  console.log("Running Daily Reminder check...");
  const users = await User.find({});
  const today = new Date().toISOString().slice(0, 10);

  for (let user of users) {
    const hasLog = await Transaction.findOne({
      userId: user._id,
      date: { $gte: new Date(today) }
    });

    if (!hasLog) {
      io.to(user._id.toString()).emit("notification", {
        title: "Daily Reminder ⚡",
        message: "You haven't logged your expenses today! Keep your financial streak alive."
      });
    }
  }
});

server.listen(8080, () => {
  console.log("Server running on port 8080");

  // 🔥 INSTANT TEST PUSH ON STARTUP
  setTimeout(() => {
    console.log("Firing startup test notification...");
    io.emit("notification", {
      title: "VaultCore Live! 🚀",
      message: "The real-time notification engine has restarted and is ready."
    });
  }, 3000);
});