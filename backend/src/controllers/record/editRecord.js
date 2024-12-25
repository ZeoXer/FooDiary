const { Record } = require('../../models/record');

// 編輯飲食紀錄
const editRecord = async (req, res) => {
    const { recordID, foodContent } = req.body;
    console.log(recordID, foodContent);

    try {
        const record = await Record.findById(recordID);

        if (!record) {
            return res.status(404).json({ message: '找不到該紀錄' });
        }

        // 更新餐別和食物內容
        record.foodContent = foodContent;

        // 計算總卡路里
        let totalCalories = 0;
        foodContent.forEach(food => {
            if (food.calories) {
                totalCalories += food.calories;
            }
        });

        // 更新總卡路里
        record.calories = totalCalories;

        // 儲存更新後的紀錄
        await record.save();

        return res.status(200).json({ success: 1, message: '更新紀錄成功' });
    } catch (err) {
        console.error('更新紀錄時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { editRecord };
