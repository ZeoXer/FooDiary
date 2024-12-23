const { Record } = require('../../models/record');  

// 刪除飲食記錄
const deleteRecord = async (req, res) => {
    const { recordID } = req.body;  

    if (!recordID) {
        return res.status(400).json({ message: '缺少必要的參數 recordID' });
    }

    try {
        const record = await Record.findByIdAndDelete(recordID);

        if (!record) {
            return res.status(404).json({ message: '找不到該紀錄' });
        }

        return res.status(200).json({
            "success": true,
            "message": "刪除紀錄成功"
          }
          );
    } catch (err) {
        
        console.error('刪除紀錄時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { deleteRecord };
