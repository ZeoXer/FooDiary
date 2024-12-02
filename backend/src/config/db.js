require('dotenv').config();  

const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Atlas 連線成功');
    } catch (err) {
        console.error('MongoDB Atlas 連線失敗:', err.message);
        process.exit(1);  
    }
};

module.exports = connectDB;

