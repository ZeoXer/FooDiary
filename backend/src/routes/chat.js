const express = require('express');
const router = express.Router();
const chatHistoryController = require("../controllers/chat/chatHistory");
const recommendationController = require("../controllers/chat/recommendation");

// 查詢聊天紀錄
router.get("/getChatRecords", chatHistoryController.getChatRecords);

// 查詢聊天紀錄
router.post("/generateRecommendation", recommendationController.generateRecommendation);


module.exports = router;