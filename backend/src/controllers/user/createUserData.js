const { UserData, UserDataModel } = require('../../models/userdata');
const { User } = require('../../models/user');
const moment = require('moment');

// 建立使用者資料控制器
const createUserData = async (req, res) => {
    const { birthDate, height, weight, gender, exerciseFrequency } = req.body;
    const userID = req.user.userID;  

    try {
        // 檢查使用者是否存在
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        // 檢查該用戶是否已經有資料
        const existingUserData = await UserData.findOne({ userID });
        if (existingUserData) {
            return res.status(400).json({ message: '該用戶已經有資料' });
        }

        // 驗證輸入資料
        const { error } = UserDataModel.validate(req.body);
        if (error) {
            return res.status(400).json({ message: `驗證錯誤: ${error.details[0].message}` });
        }

        // 建立新的使用者資料 (BMR 和年齡自動計算)
        await UserData.createUserData({
            userID,
            birthDate: moment(birthDate, 'YYYY-MM-DD', true).toISOString(),
            height,
            weight,
            gender,
            exerciseFrequency
        });

        res.status(200).json({ message: '成功建立使用者資料' });
    } catch (err) {

        console.error('錯誤:', err);
        res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { createUserData };



