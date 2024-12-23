const { Record } = require('../../models/record');

// 獲取飲食紀錄
const getRecord = async (req, res) => {
    const { date } = req.query; 
    const userID = req.user.userID; 

    try {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const records = await Record.find({
            userID,
            mealTime: { $gte: startDate, $lt: endDate },
        });

        if (!records || records.length === 0) {
            return res.status(404).json({ message: '未找到該日期的紀錄' });
        }

        return res.status(200).json(records);
    } catch (err) {
        console.error('獲取紀錄時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { getRecord };
