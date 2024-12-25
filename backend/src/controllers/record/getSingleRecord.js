const { Record } = require('../../models/record');

// 獲取單筆飲食紀錄
const getSingleRecord = async (req, res) => {
    const userID = req.user.userID;
    const { date } = req.query;

    try {
        // 驗證必要參數
        if (!date) {
            return res.status(400).json({ message: '缺少必要的參數 date' });
        }

        // 驗證日期格式
        const queryDate = new Date(date);
        if (isNaN(queryDate.getTime())) {
            return res.status(400).json({ message: '日期格式無效，請使用 YYYY-MM-DD 格式' });
        }

        // 定義當日的時間範圍
        const startOfDay = new Date(queryDate.setHours(8, 0, 0, 0));
        const endOfDay = new Date(queryDate.setHours(31, 59, 59, 999));

        // 查詢當日的用餐紀錄
        const records = await Record.find({
            userID,
            mealTime: { $gte: startOfDay, $lt: endOfDay },
        }).select('_id whichMeal foodContent'); 

        if (records.length === 0) {
            return res.status(200).json({ message: '未找到該日期的用餐記錄' });
        }

        
        const result = records.map(record => ({
            recordID: record._id,
            whichMeal: record.whichMeal,
            foodDetails: record.foodContent.map(food => ({
                foodName: food.foodName, 
                weight: food.weightInGram, 
                calories: food.calories 
            }))
        }));

        return res.status(200).json(result);
    } catch (err) {
        console.error('獲取單日記錄時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { getSingleRecord };