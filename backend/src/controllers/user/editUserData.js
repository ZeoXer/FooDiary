const { UserData, UserDataModel } = require('../../models/userdata');
const moment = require('moment');

// 更新使用者資料
const editUserData = async (req, res) => {
    const userID = req.user.userID; 
    const { birthDate, height, weight, gender, exerciseFrequency } = req.body;

    try {
        const { error } = UserDataModel.validate({
            birthDate,
            height,
            weight,
            gender,
            exerciseFrequency
        });
        if (error) {
            return res.status(400).json({ message: `驗證錯誤: ${error.details[0].message}` });
        }

        // 查找要更新的使用者資料
        const userData = await UserData.findOne({ userID });
        if (!userData) {
            return res.status(404).json({ message: '找不到對應的使用者資料' });
        }

        // 更新資料
        userData.birthDate = moment(birthDate, 'YYYY-MM-DD', true).toISOString();
        userData.height = height;
        userData.weight = weight;
        userData.gender = gender;
        userData.exerciseFrequency = exerciseFrequency;

        // 重新計算年齡和 BMR
        userData.age = userData.calculateAge();
        userData.bmr = userData.calculateBMR();

        // 保存更新
        await userData.save();

        res.status(200).json({ message: '成功更新使用者資料', data: userData });
    } catch (err) {

        console.error('錯誤:', err);
        res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { editUserData };

