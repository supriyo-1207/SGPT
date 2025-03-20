const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating verification code
const { sendVerificationEmail } = require("../Utility/emailService");
const logger = require('../Utility/logger');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

exports.postRegister = async (req, res) => {
    try {
        // Extract user data
        const { fullName, email, password, confirmPassword } = req.body;
        logger.debug(`Registering user with email: ${email}`);
        // Validate required fields
        if (!fullName || !email || !password || !confirmPassword) {
            logger.error('Registration failed: Missing required fields');
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
          logger.error('Registration failed: Passwords do not match');
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.error('Registration failed: User already exists');
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a verification code
        const verificationCode = generateOTP();
        const verificationCodeExpires = Date.now() + 3600000; // 1 hour from now

        // Create new user
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            verificationCode,
            verificationCodeExpires
        });

        // Save user to database
        await user.save();

        // Send verification email (you need to implement this function)
        sendVerificationEmail(email, verificationCode);

        logger.info('User registered successfully');
        // Send response
        res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account.',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        logger.error('Error during registration:', error);
        console.error("Error during registration:", error);
        res.status(500).json({ message: error.message });
    }
};



exports.verifyEmail = async (req, res) => {
    try {
     
      const { code } = req.body; // Get verification code from query params
      
      if (!code) {
        logger.error('Email verification failed: Verification code is required');
        return res.status(400).json({ message: "Verification code is required" });
      }
      // Find user by verification code and check if it's still valid
      const user = await User.findOne({
        verificationCode: code,
        verificationCodeExpires: { $gt: Date.now() }, // Check if the code is not expired
      });
  
      if (!user) {
        logger.error('Email verification failed: User not found or verification code is expired');
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
  
      // Mark user as verified and clear verification code
      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();
  
      // Send response
      logger.info('Email verified successfully');
      res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
      logger.error('Error during email verification:', error);
      console.error("Error during email verification:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Resend verification email
  exports.resendVerificationEmail = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        logger.error('Resending verification email failed: Email is required');
        return res.status(400).json({ message: "Email is required" });
      }
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        logger.error('Resending verification email failed: User not found');
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user is already verified
      if (user.isVerified) {
        logger.error('Resending verification email failed: User is already verified');
        return res.status(400).json({ message: "User is already verified" });
      }
  
      // Generate a new verification code
      const verificationCode = generateOTP();
      const verificationCodeExpires = Date.now() + 3600000; // 1 hour from now
  
      // Update user with new verification code
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
      await user.save();
  
      // Send verification email
      await sendVerificationEmail(email, verificationCode);
  
      // Send response
      logger.info('Resending verification email: Email resent successfully');
      res.status(200).json({ message: "Verification email resent successfully." });
    } catch (error) {
      logger.error('Resending verification email failed: Error resending verification email:', error);
      console.error("Error resending verification email:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };