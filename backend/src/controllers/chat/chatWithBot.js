const WebSocket = require('ws');
const apiService = require('../../services/RAGService');
const { User } = require('../../models/user');
const { ChatRecord } = require('../../models/chatRecord');

const socketMap = new Map();

const chatController = {

    handleWebSocketConnection: (ws) => {
        console.log('A new user connected');

        ws.isAlive = true;

        // 測試用
        console.log("Connected users:", Array.from(socketMap.keys()));
        // 

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.on('message', async (message) => {
            try {
                const { email, queryText } = JSON.parse(message);
        
                // 驗證 email 和 queryText
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email) || !queryText) {
                    ws.send(JSON.stringify({ error: 'Valid email and queryText are required' }));
                    return;
                }
        
                const user = await User.findOne({ email });
                if (!user) {
                    ws.send(JSON.stringify({ error: 'User not found' }));
                    return;
                }
        
                const userIdString = user._id.toString();
        
                // 檢查用戶是否已有 WebSocket 連線
                if (!socketMap.has(userIdString)) {
                    // 如果沒有，將當前的 WebSocket 存入 map
                    socketMap.set(userIdString, ws);
                    console.log(`New WebSocket connection for userId: ${userIdString}`);
                } else {
                    console.log(`Existing WebSocket connection for userId: ${userIdString}`);
                }
        
                // 測試用
                console.log("Connected users:", Array.from(socketMap.keys()));
        
                // 處理機器人回應
                console.log(userIdString, queryText);
                const botResponse = await apiService.chatWithBot(userIdString, queryText);
                console.log(botResponse);
        
                // 儲存用戶與機器人訊息
                const userMessageRecord = new ChatRecord({
                    userID: user._id,
                    chatContent: queryText,
                });
        
                const botMessageRecord = new ChatRecord({
                    userID: user._id,
                    chatContent: botResponse,
                });
        
                await userMessageRecord.save().catch(err => {
                    console.error('Error saving user message:', err);
                    ws.send(JSON.stringify({ error: 'Error saving user message' }));
                });
        
                await botMessageRecord.save().catch(err => {
                    console.error('Error saving bot message:', err);
                    ws.send(JSON.stringify({ error: 'Error saving bot message' }));
                });
        
                // 發送回應給前端
                ws.send(JSON.stringify({ response: botResponse }));
        
            } catch (err) {
                console.error('Error handling WebSocket message:', err);
                ws.send(JSON.stringify({ error: `Internal Server Error: ${err.message}` }));
            }
        });
        

        ws.on('close', () => {
            console.log('A user disconnected');

            for (const [userId, socket] of socketMap.entries()) {
                if (socket === ws) {
                    socketMap.delete(userId);
                    console.log(`Removed userId ${userId} from socketMap`);
                    break;
                }
            }
            // 測試用
            console.log("Connected users:", Array.from(socketMap.keys()));
            //
        });
    }
};

setInterval(() => {
    socketMap.forEach((socket, userId) => {
        if (!socket.isAlive) {
            console.log(`Removing inactive userId ${userId}`);
            socketMap.delete(userId);
            socket.terminate();
            return;
        }

        socket.isAlive = false;
        socket.ping();
    });
}, 30000);

module.exports = chatController;