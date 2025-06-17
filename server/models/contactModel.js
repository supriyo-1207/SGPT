const mongoose = require("mongoose");

const SupportRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Store the user's ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending", enum: ["Pending", "Resolved"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportRequest", SupportRequestSchema);