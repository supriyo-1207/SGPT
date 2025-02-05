// Create Message Schema first
const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  session_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChatSession', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['user', 'bot'], 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;