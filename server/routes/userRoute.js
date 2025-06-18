const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerControllers');
const loginController = require('../controllers/loginControllers');
const chatController = require('../controllers/chatControllers');
const authenticateUser = require('../middleware/authenticateUser');
const restrictLoggedInUsers = require('../middleware/restrictLoggedInUsers');

//  Authentication Routes
// Register route (only accessible to non-logged-in users)
router.post("/register", restrictLoggedInUsers, registerController.postRegister);

// Login route (only accessible to non-logged-in users)
router.post("/login", restrictLoggedInUsers, loginController.postLogin);

// Logout route (only accessible to logged-in users)
router.post("/logout", authenticateUser, loginController.postLogout);

// Auth check route (only accessible to logged-in users)
router.get("/auth/check", authenticateUser, (req, res) => {
    res.json({ user: req.user });
});

// Verify email route (accessible to anyone with a valid verification code)
router.post("/verify-email", registerController.verifyEmail);

// Resend verification email route (accessible to non-logged-in users)
router.post("/resend-verification", restrictLoggedInUsers, registerController.resendVerificationEmail);

//  Chat Routes (Requires Authentication)
router.get('/chat', authenticateUser, chatController.getChat);
router.get('/chat/sessions', authenticateUser, chatController.getSessions);
router.post('/chat/sessions', authenticateUser, chatController.postSession);
router.get('/chat/sessions/:sessionId/messages', authenticateUser, chatController.getSessionMessages);
router.post('/chat/messages', authenticateUser, chatController.postMessage);
router.delete('/chat/sessions/:sessionId', authenticateUser, chatController.deleteSession); // Added for session deletion


// for testing purposes
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend is live' });
});

module.exports = router;
