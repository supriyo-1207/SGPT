const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.postRegister = async (req, res) => {
    try {
        // Extract user data
        const { name, email, gender, password } = req.body;

        // Validate required fields
        if (!name || !email || !gender || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            gender,
            password: hashedPassword
        });

        // Save user to database
        await user.save();

        // Send response (without password)
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender
            }
        });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: error.message });
    }
};
