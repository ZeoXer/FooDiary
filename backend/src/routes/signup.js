const express = require('express');
const router = express.Router();

const signupController = require('../controllers/auth/signupController');

// 註冊
router.post('/', signupController.signup);


module.exports = router;

