const mongoose = require("mongoose");

const ChatSessionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session_name: { type: String, required: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    last_activity: { type: Date, default: Date.now },
    message_count: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("ChatSession", ChatSessionSchema);


// {
//     "_id": "65b6f97e1a2c4e5a8b2f1d36",
//     "user_id": "64a8b5c6d20f3c7b5c9a8e72",
//     "session_name": "Chat with AI",
//     "createdAt": "2024-02-05T10:30:00.123Z",  //  Automatically generated
//     "updatedAt": "2024-02-05T10:30:00.123Z"   //  Initially same as createdAt
// }
