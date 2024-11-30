const { User } = require('../../models/user');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');


// JWT 秘鑰和選項
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

// 登入
const login = async (req, res) => {
    const { email, password } = req.body;

    // 檢查是否提供有電子郵件和密碼
    if (!email || !password) {
        return res.status(400).json({ message: '請提供電子郵件和密碼' });
    }

    try {
        const user = await User.findOne({ email });

        // 檢查用戶是否存在
        if (!user) {
            return res.status(404).json({ message: '用戶不存在，請註冊帳號' });
        }

        // 驗證密碼是否正確
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: '密碼錯誤，請重試' });
        }

        // 生成 JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // payload
            JWT_SECRET, // secret key
            { expiresIn: JWT_EXPIRES_IN } // options
        );

        // 回傳用戶資訊和 token
        res.status(200).json({message: '登入成功',token});

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: '伺服器發生錯誤，請稍後再試' });
    }
};

module.exports = { login };

