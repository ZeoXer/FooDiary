const express = require('express');
const router = express.Router();

const loginController = require('../controllers/auth/loginCrotroller');

// 一般登入
router.post('/', loginController.login);

module.exports = router;
