const express = require('express');
const router = express.Router();
const loginController = require('../controllers/auth/loginController');
const signupController = require('../controllers/auth/signupController');

// 一般登入
router.post('/login', loginController.login); 

// 註冊
router.post('/signup', signupController.signup); 


module.exports = router;