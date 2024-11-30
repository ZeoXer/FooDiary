const express = require('express');
const router = express.Router();
const { createUserData } = require('../controllers/user/createUserData');

// 建立使用者資料
router.post('/', createUserData);

module.exports = router;
