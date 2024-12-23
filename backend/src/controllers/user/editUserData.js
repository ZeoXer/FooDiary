const { UserData } = require('../../models/userdata'); 
const { User } = require('../../models/user'); // 引入 User 模型

// 更新使用者資料
const editUserData = async (req, res) => {
    const userID = req.user.userID; 
    const { userName, email, age, height, weight, exerciseFrequency } = req.body; // 包括 age

    try {
        // 查找要更新的使用者資料
        let userData = await UserData.findOne({ userID }); 
        if (!userData) {
            return res.status(404).json({ message: '找不到對應的使用者資料' });
        }

        // 查找並更新使用者名稱和電子郵件
        let user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: '找不到使用者' });
        }
        
        if (userName) {
            user.userName = userName; 
        }
        if (email) {
            user.email = email; 
        }

        // 直接更新年齡
        if (age !== undefined) {
            userData.age = age; 
        }

        // 更新其他資料
        if (height) {
            userData.height = height;
        }
        if (weight) {
            userData.weight = weight;
        }
        if (exerciseFrequency) {  
            userData.exerciseFrequency = exerciseFrequency;
        }

        await userData.save();
        await user.save(); 

        res.status(200).json({ message: '成功更新使用者資料', data: userData });
    } catch (err) {
        console.error('錯誤:', err);
        res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { editUserData };
