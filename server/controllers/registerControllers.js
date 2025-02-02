const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Register a new user
exports.postRegister = async (req, res) => {
    try {
        // Destructure data from request body
        const { fullName, email, gender, password } = req.body;
        // console.log(req.body);

        // Check if any field is empty
        if (!fullName || !email || !gender || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user   
        const user = new User({
            name: fullName,  // Use fullName here
            email,
            gender,
            password: hashedPassword
        });
        console.log('user', user);

        // Save the user to the database
        await user.save();

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

