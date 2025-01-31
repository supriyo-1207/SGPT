const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatControllers');

router.get('/chat', chatController.getChat);

module.exports = router;