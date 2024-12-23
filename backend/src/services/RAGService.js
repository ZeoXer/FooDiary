const axios = require("axios");

const apiService = {

    healthCheck: async () => {
        try {
            const response = await axios.get("https://foodiary-rag.zeoxer.com/health");
            return response.data;
        } catch (err) {
            throw new Error("Health check failed: " + err.message);
        }
    },

    chatWithBot: async (userId, queryText) => {
        try {
            const response = await axios.post("https://foodiary-rag.zeoxer.com/chatWithBot", {
                user_id: userId,
                query_text: queryText,
            });
            return response.data.response;
        } catch (err) {
            throw new Error("Chat with bot failed: " + err.message);
        }
    },

    getChatRecords: async (userId, timestamp) => {
        try {
            const url = `https://foodiary-rag.zeoxer.com/getChatRecords/${userId}?timestamp=${timestamp || ''}`;
            const response = await axios.get(url);
            return response.data.content;
        } catch (err) {
            throw new Error("Get chat records failed: " + err.message);
        }
    },
};

module.exports = apiService;

