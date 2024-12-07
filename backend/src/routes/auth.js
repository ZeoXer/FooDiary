const express = require('express');
const router = express.Router();
const loginController = require('../controllers/auth/loginCrotroller');
const signupController = require('../controllers/auth/signupController');
const forgetPasswordController = require('../controllers/auth/forgetPasswordController');

// 一般登入
router.post('/login', loginController.login); 

// 註冊
router.post('/signup', signupController.signup); 

// 忘記密碼
router.post('/forgetPassword', forgetPasswordController.forgetPassword);


module.exports = router;