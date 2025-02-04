const User = require('../models/userModel');
const Session = require('../models/session');
const Message = require('../models/message');
const mongoose = require('mongoose');

exports.getChat = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_data = await User.findById(user_id).select('-password');
        if (!user_data) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Login successful', user: user_data });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getSessions = async (req, res) => {
    try {
        // Changed from sessions to Session (model name)
        const sessions = await Session.find({ userId: req.user.id })
            .sort({ updatedAt: -1 })
            .limit(50);

        res.json({ sessions });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ message: 'Error fetching chat sessions' });
    }
};

exports.postSession = async (req, res) => {
    try {
        const session = new Session({
            userId: req.user.id,
            lastMessage: "New conversation",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedSession = await session.save();
        
        // Send back the complete session object
        res.status(201).json({ 
            session: {
                _id: savedSession._id,
                userId: savedSession.userId,
                lastMessage: savedSession.lastMessage,
                createdAt: savedSession.createdAt,
                updatedAt: savedSession.updatedAt
            }
        });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Error creating chat session' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Changed from session to Session (model name)
        const session = await Session.findOne({
            _id: sessionId,
            userId: req.user.id
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const messages = await Message.find({ sessionId })
            .sort({ timestamp: 1 });

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

exports.postMessage = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { sessionId } = req.params;
        const { message } = req.body;

        // Validate sessionId
        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Invalid session ID' });
        }

        const chatSession = await Session.findOne({
            _id: sessionId,
            userId: req.user.id
        });

        if (!chatSession) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Session not found' });
        }

        // Save user message
        const userMessage = new Message({
            sessionId,
            text: message,
            type: 'user',
            timestamp: new Date()
        });
        await userMessage.save({ session });

        // Generate bot response
        const botResponse = await generateBotResponse(message);

        // Save bot message
        const botMessage = new Message({
            sessionId,
            text: botResponse,
            type: 'bot',
            timestamp: new Date()
        });
        await botMessage.save({ session });

        // Update session with last message
        chatSession.lastMessage = message;
        chatSession.updatedAt = new Date();
        await chatSession.save({ session });

        await session.commitTransaction();

        res.json({
            message: botResponse,
            userMessage: userMessage,
            botMessage: botMessage
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error processing message:', error);
        res.status(500).json({ message: 'Error processing message' });
    } finally {
        session.endSession();
    }
};
// Placeholder for bot response generation
async function generateBotResponse(message) {
    // Implement your chat bot logic here
    
    return `Echo: ${message}`;
}

// Add delete session functionality
exports.deleteSession = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { sessionId } = req.params;

        const chatSession = await Session.findOne({
            _id: sessionId,
            userId: req.user.id
        });

        if (!chatSession) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Session not found' });
        }

        // Delete all messages in the session
        await Message.deleteMany({ sessionId }, { session });

        // Delete the session
        await Session.deleteOne({ _id: sessionId }, { session });

        await session.commitTransaction();

        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error deleting session:', error);
        res.status(500).json({ message: 'Error deleting session' });
    } finally {
        session.endSession();
    }
};