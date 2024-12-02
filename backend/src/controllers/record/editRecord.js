const { Record } = require('../../models/record');  

// 編輯飲食紀錄
const editRecord = async (req, res) => {
    const { recordID, whichMeal, mealTime, foodContent, calories } = req.body;  

    if (!recordID || !whichMeal || !mealTime || !foodContent || !calories) {
        return res.status(400).json({ message: '缺少必要的參數' });
    }

    try {
        const record = await Record.findById(recordID);

        if (!record) {
            return res.status(404).json({ message: '找不到該紀錄' });
        }

        record.whichMeal = whichMeal;
        record.mealTime = mealTime;
        record.foodContent = foodContent;
        record.calories = calories;

        await record.save();

        return res.status(200).json({ message: '更新紀錄成功' });
    } catch (err) {

        console.error('更新紀錄時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { editRecord };

