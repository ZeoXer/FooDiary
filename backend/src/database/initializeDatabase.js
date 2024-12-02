require('dotenv').config();  

const { ChatRecord } = require('../models/chatRecord'); 
const { Record } = require('../models/record'); 
const { User } = require('../models/user'); 
const { UserData } = require('../models/userdata'); 

// 初始化函數
const initializeDatabase = async () => {
    try {
        console.log('🔄 Initializing database...');

        // 清空現有資料 (僅測試環境使用)
        await ChatRecord.deleteMany({});
        await Record.deleteMany({});
        await User.deleteMany({});
        await UserData.deleteMany({});
        console.log('✅ Existing data cleared.');

        // 插入測試用 User 資料
        const user = new User({
            userName: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456', 
        });
        await user.save();

        // 插入測試用 UserData 資料
        const userData = new UserData({
            userID: user._id,
            birthDate: new Date('1990-01-01'),
            height: 180,
            weight: 75,
            gender: 0,
            exerciseFrequency: 3,
        });
        await userData.save();

        // 插入測試用 Record 資料
        const record = new Record({
            userID: user._id,
            whichMeal: 'Breakfast',
            mealTime: new Date(),
            foodContent: [
                { foodName: 'Apple', weightInGram: 150, calories: 80 },
                { foodName: 'Bread', weightInGram: 100, calories: 250 },
            ],
        });
        await record.save();

        // 插入測試用 ChatRecord 資料
        const chatRecord = new ChatRecord({
            userID: user._id,
            chatContent: 'Hello, I just logged my breakfast!',
        });
        await chatRecord.save();

        console.log('✅ Database initialized with sample data.');
    } catch (err) {
        console.error('❌ Database initialization failed:', err);
    }
};

module.exports = initializeDatabase;