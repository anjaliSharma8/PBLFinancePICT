const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // 1. Extract 'name' along with email and password from the request
    const { name, email, password } = req.body;

    // Optional: Basic validation to make sure no fields are left empty
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Include the name when creating the new User
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({
      message: "Registered successfully"
    });

  } catch (err) {
    console.error(err); // Good practice to log the error for debugging
    res.status(500).json({
      message: "Server error"
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 3. Return the user's data (including name) so your frontend can use it!
    res.json({
      message: "Login successful",
      token,
      user: {
          id: user._id,
          name: user.name,
          email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;