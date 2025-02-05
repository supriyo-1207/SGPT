const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerControllers');
const loginController = require('../controllers/loginControllers');
const chatController = require('../controllers/chatControllers');
const authenticateUser = require('../middleware/authenticateUser ');

// ✅ Authentication Routes
router.post('/register', registerController.postRegister);
router.post('/login', loginController.postLogin);
router.post('/logout', authenticateUser, loginController.postLogout);

// ✅ Chat Routes (Requires Authentication)
router.get('/chat', authenticateUser, chatController.getChat);
router.get('/chat/sessions', authenticateUser, chatController.getSessions);
router.post('/chat/sessions', authenticateUser, chatController.postSession);
router.get('/chat/sessions/:sessionId/messages', authenticateUser, chatController.getSessionMessages);
router.post('/chat/messages', authenticateUser, chatController.postMessage);
// router.delete('/chat/sessions/:sessionId', authenticateUser, chatController.deleteSession); // Added for session deletion

module.exports = router;
