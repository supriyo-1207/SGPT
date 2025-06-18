const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postLogin = async (req, res) => {
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
      { expiresIn: '1h' } // Token will expire in 1 hour
    );

    // Set cookie with appropriate options
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in Vercel
      sameSite: 'None', // Required for cross-origin cookies
      path: '/',
      maxAge: 3600000, // 1 hour
    });


    // Send success response with user details
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name, // Including name for personalization, if needed
        gender: user.gender
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.postLogout = async (req, res) => {
  try {
    // Clear token cookie
    res.clearCookie("token", {
      httpOnly: true, // Keeps the cookie secure from client-side JS
      secure: process.env.NODE_ENV === 'production', // Ensures security in production
      sameSite: 'lax', // Helps prevent CSRF attacks
      path: '/' // Applies to the entire site
    });


    // Send success response
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};