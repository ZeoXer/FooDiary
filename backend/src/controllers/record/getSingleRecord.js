const { Record } = require('../../models/record'); 

// 獲取單筆飲食紀錄
const getSingleRecord = async (req, res) => {
    const { userID, date } = req.query; 

    try {
    
        if (!userID || !date) {
            return res.status(400).json({ message: '缺少必要的參數 userID 或 date' });
        }

        const queryDate = new Date(date);
        if (isNaN(queryDate)) {
            return res.status(400).json({ message: '日期格式無效，請使用 YYYY-MM-DD 格式' });
        }

        const records = await Record.find({
            userID,
            mealTime: {
                $gte: new Date(queryDate.setHours(0, 0, 0, 0)), 
                $lt: new Date(queryDate.setHours(23, 59, 59, 999)), 
            },
        }).select('_id whichMeal foodContent calories'); 

        if (records.length === 0) {
            return res.status(404).json({ message: '未找到該日期的用餐記錄' });
        }

        const result = records.map(record => ({
            recordID: record._id,
            whichMeal: record.whichMeal,
            calories: record.foodContent.reduce((sum, food) => sum + food.calories, 0), // 累加食物卡路里
        }));

        res.status(200).json(result);
    } catch (err) {
        console.error('獲取單日記錄時出現錯誤:', err);
        res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { getSingleRecord };
