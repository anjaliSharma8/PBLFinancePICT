const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

  // Get token from header
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Format: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format." });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = verified;

    next(); // move to next middleware / route

  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};