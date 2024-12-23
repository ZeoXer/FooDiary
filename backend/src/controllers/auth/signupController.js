const { User } = require('../../models/user');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&*!]{8,}$/;

// 註冊
exports.signup = async (req, res) => {

    try{
        const { userName, email, password } = req.body;

        // 確保所有欄位不為空
        if (!userName || !email || !password) {
            return res.status(400).json({ message: '所有欄位都是必填的' });
        }

        // 確保電子郵件格式正確
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: '無效的電子郵件格式' });
        }

        // 密碼格式檢查
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: '密碼必須至少包含一個小寫字母、一個大寫字母、一個數字，並且長度至少為 8 個字符'
            });
        }

        // 檢查用戶是否已經存在
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '用戶已經存在' });
        }

        // 建立新用戶
        await User.createUser({ userName, email, password });

        // 註冊成功，返回用戶資料
        res.status(201).json({ message: '註冊成功'});

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
    }
};



