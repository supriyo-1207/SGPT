const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postLoging = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create and assign a token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set cookie with appropriate options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false in development
      sameSite: 'lax', // Changed from Strict to allow redirects
      path: '/',
      maxAge: 3600000, // 1 hour
      domain: 'localhost' // Important for local development
    });

    // Send success response
    res.status(200).json({ 
      message: "Login successful",
      user: { 
        id: user._id,
        email: user.email 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};