const express = require('express');
const router = express.Router();

const { updatePassword } = require('../controllers/user/updataPassword');

// 更新密碼路由
router.put('/', updatePassword);

module.exports = router;
