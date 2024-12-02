const { User } = require('../../models/user'); 
const { UserData } = require('../../models/userdata'); 
const { Record } = require('../../models/record'); 
const { ChatRecord } = require('../../models/chatrecord'); 

// 刪除使用者
const deleteUser = async (req, res) => {
    const { userID } = req.body; 

    try {
        // 確認該使用者是否存在
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: '找不到該使用者' });
        }

        // 刪除與該使用者相關的資料
        const deleteUserData = UserData.deleteMany({ userID });
        const deleteRecords = Record.deleteMany({ userID });
        const deleteChatRecords = ChatRecord.deleteMany({ userID });

        // 等待所有刪除操作完成
        await Promise.all([deleteUserData, deleteRecords, deleteChatRecords]);

        // 刪除使用者本身
        await User.findByIdAndDelete(userID);

        return res.status(200).json({ message: '刪除使用者及相關資料成功' });
    } catch (err) {
        console.error('刪除使用者時出現錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { deleteUser };

