const { Record } = require('../../models/record');

// 新增用餐紀錄
const addRecord = async (req, res) => {
    const userID = req.user.userID; 
    const { whichMeal, mealTime, foodContent, calories, suggestion } = req.body;

    try {
        if (!whichMeal || !mealTime || !foodContent || !calories) {
            return res.status(400).json({ message: '請提供完整的用餐紀錄資料' });
        }

        // 建立新的用餐紀錄
        const newRecord = new Record({
            userID,
            whichMeal,
            mealTime,
            foodContent,
            calories,
            suggestion
        });

        await newRecord.save();

        return res.status(200).json({ message: '新增紀錄成功', data: newRecord });
    } catch (err) {
        console.error('新增紀錄時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { addRecord };
