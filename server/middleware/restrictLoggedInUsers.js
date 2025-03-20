const jwt = require("jsonwebtoken");

const restrictLoggedInUsers = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded) {
        // If the token is valid, the user is already logged in
        return res.status(403).json({ message: "You are already logged in" });
      }
    }

    // If no token or invalid token, proceed to the next middleware
    next();
  } catch (error) {
    // If the token is invalid or expired, proceed to the next middleware
    next();
  }
};

module.exports = restrictLoggedInUsers;