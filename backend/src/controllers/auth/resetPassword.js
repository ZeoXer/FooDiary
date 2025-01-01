const { User } = require('../../models/user');
const { redisClient } = require("../../config/redis");
const bcrypt = require('bcrypt');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&*!]{8,}$/;

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    // 檢查是否提供有 token 和密碼
    if (!token || !newPassword) {
        return res.status(400).json({ message: '請提供新密碼' });
    }

    // 檢查 token 是否存在 or 過期
    const userToken = await redisClient.get(`PASSWORD:RESET:${token}`);
    if (!userToken) { 
        return res.status(400).json({ message: '請重新申請忘記密碼' });
    }

    const { email } = JSON.parse(userToken);

    // 檢查新密碼格式
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            message: '密碼必須至少包含一個小寫字母、一個大寫字母、一個數字，並且長度至少為 8 個字符'
        });
    }

    try {
        user = await User.findOne({ email });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await redisClient.del(`PASSWORD:RESET:${token}`);
        return res.status(200).json({ message: '密碼重設成功' });
    } catch (error) {
        return res.status(500).json({ message: '密碼重設失敗，請重試' });
    }
};

module.exports = { resetPassword };