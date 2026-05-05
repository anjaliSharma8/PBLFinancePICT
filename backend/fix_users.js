const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

async function fixUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.updateMany(
    { name: { $exists: false } },
    { $set: { name: "User" } }
  );
  console.log(`Updated ${result.modifiedCount} users missing names.`);
  
  const result2 = await User.updateMany(
    { name: null },
    { $set: { name: "User" } }
  );
  console.log(`Updated ${result2.modifiedCount} users with null names.`);

  process.exit();
}

fixUsers();
