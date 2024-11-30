const { User } = require('../../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Joi 驗證
const updatePasswordModel = Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
});

// 更新密碼
const updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    // 資料驗證
    const { error } = updatePasswordModel.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // 查找使用者
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        // 驗證舊密碼
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '舊密碼不正確' });
        }

        // 密碼檢查
        const passwordStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&*!]{8,}$/; 
        if (!passwordStrength.test(newPassword)) {
            return res.status(400).json({ message: '新密碼必須至少包含一個小寫字母、一個大寫字母、一個數字，並且長度至少為 8 個字符' });
        }

        // 更新密碼
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: '更新密碼成功' });

    } catch (err) {

        console.error(err);  
        res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { updatePassword };

