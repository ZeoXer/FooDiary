﻿const WebSocket = require('ws');
const apiService = require('../../services/RAGService');
const { User } = require('../../models/user');
const { ChatRecord } = require('../../models/chatRecord');

const chatController = {

    handleWebSocketConnection: (ws) => {
        console.log('A new user connected');
        
        ws.on('message', async (message) => {
            try {
                const { email, queryText } = JSON.parse(message);

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

                const botResponse = await apiService.chatWithBot(userIdString, queryText);

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

                ws.send(JSON.stringify({ response: botResponse }));

            } catch (err) {
                console.error('Error handling WebSocket message:', err);
                ws.send(JSON.stringify({ error: `Internal Server Error: ${err.message}` }));
            }
        });

        ws.on('close', () => {
            console.log('A user disconnected');
        });
    }
};

module.exports = chatController;


