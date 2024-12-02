const { Record } = require('../../models/record');  

// 獲取卡路里
const getCalories = async (req, res) => {
    const { userID, startDate, endDate } = req.query;  

    if (!userID || !startDate || !endDate) {
        return res.status(400).json({ message: '缺少必要的參數 userID, startDate 或 endDate' });
    }

    try {
        const records = await Record.find({
            userID,
            mealTime: { $gte: new Date(startDate), $lte: new Date(endDate) }  
        });

        if (records.length === 0) {
            return res.status(200).json([]);
        }

        const calorieData = [];

        records.forEach(record => {
            const mealDate = record.mealTime.toISOString().split('T')[0]; 
            const dailyCalories = record.foodContent.reduce((total, food) => total + food.calories, 0);  

            const existingEntry = calorieData.find(entry => entry.date === mealDate);
            if (existingEntry) {
                existingEntry.calories += dailyCalories;
            } else {
                calorieData.push({ date: mealDate, calories: dailyCalories });
            }
        });

        return res.status(200).json(calorieData);

    } catch (err) {
        
        console.error('獲取卡路里時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { getCalories };
