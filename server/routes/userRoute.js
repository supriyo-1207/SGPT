const express=require('express');
const router=express.Router();
const registerController=require('../controllers/registerControllers');
const loginController = require('../controllers/loginControllers');
const chatController = require('../controllers/chatControllers');
const authenticateUser = require('../middleware/authenticateUser ');

// Routes
router.post('/login', loginController.postLoging);
router.post('/register',registerController.postRegister);
router.get('/chat',authenticateUser, chatController.getChat);
router.post('/chat',chatController.postChat);
router.post('/logout', authenticateUser,loginController.postLogout);

module.exports=router;