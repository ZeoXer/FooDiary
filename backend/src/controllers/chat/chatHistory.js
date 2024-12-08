const { User } = require('../../models/user');
const apiService = require("../../services/RAGService");

const chatHistoryController = {

    getChatRecords: async (req, res) => {
        const { email } = req.query;  
        let { timestamp } = req.query;  

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const user_id = user._id.toString(); 

            
            if (!timestamp) {
                timestamp = Math.floor(Date.now() / 1000); 
            }

            const chatRecords = await apiService.getChatRecords(user_id, timestamp);

            return res.json({ content: chatRecords });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch chat records from third-party API" });
        }
    }
};

module.exports = chatHistoryController;


