const mongoose = require("mongoose");

// 定義 ChatRecord Schema
const chatRecordSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, // 引用 User 模型
    time: { 
        type: Date, 
        default: Date.now 
    }, // 聊天時間
    chatContent: { 
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 2000 // 限制聊天內容長度
    } // 聊天內容
});


const ChatRecord = mongoose.model("ChatRecord", chatRecordSchema);

module.exports = { ChatRecord };
