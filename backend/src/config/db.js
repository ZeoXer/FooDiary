require('dotenv').config();

const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        // 移除 useNewUrlParser 和 useUnifiedTopology 配置
        await mongoose.connect(dbURI);
        console.log('MongoDB Atlas 連線成功');
    } catch (err) {
        console.error('MongoDB Atlas 連線失敗:', err.message);
        process.exit(1);  // 當連線失敗時退出應用
    }
};

module.exports = connectDB;


