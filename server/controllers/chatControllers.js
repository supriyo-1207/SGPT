const User = require('../models/userModel');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message'); // You'll need to create this model
const mongoose = require('mongoose');
const { generateBotResponse } = require('../services/botService');
const marked = require("marked");
// Chat Controller
exports.getChat = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_data = await User.findById(user_id).select('-password');
        if (!user_data) {
            return res.status(401).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Login successful', user: user_data });
    } catch (error) {
        console.error('Error in getChat:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new session with proper error handling
exports.postSession = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, sessionName } = req.body;

        // Validate inputs
        if (!userId || !sessionName) {
            return res.status(400).json({
                message: 'Missing required fields: userId and sessionName are required'
            });
        }

        // Verify user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({
                message: 'User not found. Cannot create session.'
            });
        }

        // Check for existing active session with same name
        const existingSession = await ChatSession.findOne({
            user_id: userId,
            session_name: sessionName,
            status: 'active'
        });

        if (existingSession) {
            return res.status(200).json({
                message: 'Using existing session',
                sessionId: existingSession._id
            });
        }

        // Create new session
        const newSession = new ChatSession({
            user_id: userId,
            session_name: sessionName,
            status: 'active',
            last_activity: new Date(),
            message_count: 0
        });

        await newSession.save({ session });
        await session.commitTransaction();

        res.status(201).json({
            message: 'Chat session created successfully',
            sessionId: newSession._id
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error creating session:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Invalid session data',
                errors: error.errors
            });
        }

        res.status(500).json({
            message: 'Error creating chat session'
        });
    } finally {
        session.endSession();
    }
};

// Handle messages with proper session validation
exports.postMessage = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { sessionId, message, model } = req.body;
        console.log(sessionId, message, model);
        // Validate inputs
        if (!sessionId || !message) {
            return res.status(400).json({
                message: 'Missing required fields: sessionId and message are required'
            });
        }

        // Verify session exists and is active
        const chatSession = await ChatSession.findById(sessionId);
        if (!chatSession) {
            return res.status(404).json({
                message: 'Session not found'
            });
        }

        if (chatSession.status !== 'active') {
            return res.status(400).json({
                message: 'Session is no longer active'
            });
        }

        // Store user message
        const userMessage = new Message({
            session_id: sessionId,
            content: message,
            type: 'user'
        });
        await userMessage.save({ session });

        // Generate bot response (replace with your actual bot logic)
        const llmResponse = await generateBotResponse(message, model);

        // Convert Markdown to HTML
        const botResponse = marked.parse(llmResponse);

        // Store bot message
        const botMessage = new Message({
            session_id: sessionId,
            content: botResponse,
            type: 'bot'
        });
        await botMessage.save({ session });

        // Update session
        chatSession.last_activity = new Date();
        chatSession.message_count += 2; // Increment for both user and bot messages
        await chatSession.save({ session });

        await session.commitTransaction();

        res.status(200).json({
            message: botResponse,
            userMessage: userMessage,
            botMessage: botMessage
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error processing message:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Invalid message data',
                errors: error.errors
            });
        }

        res.status(500).json({
            message: 'Error processing message'
        });
    } finally {
        session.endSession();
    }
};

// Helper function for bot response (replace with your actual bot implementation)
// async function generateBotResponse(message,model) {
//     // Implement your chatbot logic here
//     // For now, just echo the message
//     return `Echo: ${message}`;
// }

// Get session messages
exports.getSessionMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        const messages = await Message.find({ session_id: sessionId })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Message.countDocuments({ session_id: sessionId });

        res.status(200).json({
            messages,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMessages: total
        });

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            message: 'Error fetching messages'
        });
    }
};

// Get user's sessions
exports.getSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = await ChatSession.find({
            user_id: userId,
            status: 'active'
        })
            .sort({ last_activity: -1 })
            .select('session_name last_activity message_count');

        res.status(200).json({ sessions });

    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({
            message: 'Error fetching sessions'
        });
    }
};

// Delete session
exports.deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        await ChatSession.findByIdAndDelete(sessionId);
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({
            message: 'Error deleting session'
        });
    }
};