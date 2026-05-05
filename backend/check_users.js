const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

async function checkUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log("Total Users:", users.length);
  users.forEach(u => {
    console.log(`Email: ${u.email}, Name: ${u.name}`);
  });
  process.exit();
}

checkUsers();
