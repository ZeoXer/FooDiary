const express = require('express');
const router = express.Router();
const loginController = require('../controllers/auth/loginController');
const signupController = require('../controllers/auth/signupController');
const forgetPasswordController = require('../controllers/auth/forgetPasswordController');
const resetPassword = require('../controllers/auth/resetPassword');

// 一般登入
router.post('/login', loginController.login); 

// 註冊
router.post('/signup', signupController.signup); 

// 忘記密碼
router.post('/forgetPassword', forgetPasswordController.forgetPassword);

// 重置密碼
router.post('/resetPassword', resetPassword.resetPassword);

module.exports = router;