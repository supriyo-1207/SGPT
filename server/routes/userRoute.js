const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerControllers');
const loginController = require('../controllers/loginControllers');
const chatController = require('../controllers/chatControllers');
const authenticateUser = require('../middleware/authenticateUser ');

// Routes
router.post('/login', loginController.postLoging);
router.post('/register', registerController.postRegister);
router.post('/logout', authenticateUser, loginController.postLogout);

// Chat routes
router.get('/chat', authenticateUser, chatController.getChat);
router.get('/chat/sessions', authenticateUser, chatController.getSessions);
router.post('/chat/sessions', authenticateUser, chatController.postSession);
router.get('/chat/sessions/:sessionId/messages', authenticateUser, chatController.getMessages);
router.post('/chat/sessions/:sessionId/messages', authenticateUser, chatController.postMessage);
router.delete('/chat/sessions/:sessionId', authenticateUser, chatController.deleteSession);

module.exports = router;