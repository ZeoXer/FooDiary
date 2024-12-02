const { Record } = require('../../models/record');  

// 獲取飲食紀錄
const getRecord = async (req, res) => {
    const { recordID } = req.query;  

    try {
        const record = await Record.findById(recordID);
        
        if (!record) {

            return res.status(404).json({ message: '未找到該紀錄' });
        }

        return res.status(200).json(record);
    } catch (err) {

        console.error('獲取紀錄時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { getRecord };
