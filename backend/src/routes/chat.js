const express = require('express');
const router = express.Router();
const chatHistoryController = require("../controllers/chat/chatHistory");

// 查詢聊天紀錄
router.get("/getChatRecords", chatHistoryController.getChatRecords);

module.exports = router;