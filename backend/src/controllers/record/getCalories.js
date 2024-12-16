const { Record } = require('../../models/record');

// 獲取卡路里
const getCalories = async (req, res) => {
    const userID = req.user.userID; 
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: '缺少必要的參數 startDate 或 endDate' });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: '無效的日期格式，請提供有效的 startDate 和 endDate' });
        }

        const records = await Record.find({
            userID,
            mealTime: { $gte: start, $lte: end },
        });

        if (records.length === 0) {
            return res.status(200).json([]); 
        }

        const calorieData = records.reduce((acc, record) => {
            const mealDate = record.mealTime.toISOString().split('T')[0]; 
            const dailyCalories = record.foodContent.reduce(
                (total, food) => total + (food.calories || 0),
                0
            );

            const existingEntry = acc.find(entry => entry.date === mealDate);
            if (existingEntry) {
                existingEntry.calories += dailyCalories;
            } else {
                acc.push({ date: mealDate, calories: dailyCalories });
            }
            return acc;
        }, []);

        return res.status(200).json(calorieData);

    } catch (err) {
        console.error('獲取卡路里時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { getCalories };

