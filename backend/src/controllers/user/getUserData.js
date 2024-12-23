const { UserData } = require('../../models/userdata');
const { User } = require('../../models/user');

const getUserData = async (req, res) => {
    const userID = req.user.userID;

    try {
        // 檢查使用者是否存在
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        // 查詢使用者資料
        const userData = await UserData.findOne({ userID })
            .populate('userID', 'userName email');  

        // 如果找不到使用者資料
        if (!userData) {
            return res.status(404).json({ message: '找不到使用者資料' });
        }

        // 返回找到的使用者資料
        return res.status(200).json({ message: '成功取得使用者資料', userData });
    } catch (err) {
        console.error('取得使用者資料時發生錯誤:', err);
        return res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { getUserData };

