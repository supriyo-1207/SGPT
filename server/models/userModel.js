const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true }, // Changed from `name` to `fullName`
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Add this for email verification
    verificationCode: { type: String }, // Store verification code
    verificationCodeExpires: { type: Date } // Store expiration time for the code
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

module.exports = mongoose.model("User", UserSchema);
// {
//     "_id": "64a8b5c6d20f3c7b5c9a8e72",
//     "name": "New Name",
//     "email": "supriyo@example.com",
//     "password_hash": "hashed_password",
//     "gender": "Male",
//     "createdAt": "2024-02-05T10:30:00.123Z",
//     "updatedAt": "2024-02-05T11:45:22.567Z"
// }
  



// // email: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     match: [/.+\@.+\..+/, "Please enter a valid email"] // Email validation
// },
// gender: { 
//     type: String, 
//     required: true, 
//     enum: ["male", "female", "other"] // Restrict values
// },