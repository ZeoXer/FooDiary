const { UserData } = require('../../models/userdata');
const { User } = require('../../models/user');
const Joi = require('joi');
const moment = require('moment');

// Joi 驗證模型
const createUserDataModel = Joi.object({
    userID: Joi.string().required().messages({
        'string.base': '"使用者 ID" 必須為字串',
        'any.required': '"使用者 ID" 為必填欄位'
    }),  // 使用者 ID
    birthDate: Joi.date().iso().required().messages({
        'date.base': '"出生日期" 必須是有效的日期格式',
        'date.isoDate': '"出生日期" 必須符合 ISO 8601 格式 (例如: YYYY-MM-DD)',
        'any.required': '"出生日期" 為必填欄位'
    }),  // 出生日期
    height: Joi.number().positive().required().messages({
        'number.base': '"身高" 必須是正數',
        'any.required': '"身高" 為必填欄位'
    }),  // 身高
    weight: Joi.number().positive().required().messages({
        'number.base': '"體重" 必須是正數',
        'any.required': '"體重" 為必填欄位'
    }),  // 體重
    gender: Joi.number().valid(0, 1).required().messages({
        'number.base': '"性別" 必須是數字',
        'any.required': '"性別" 為必填欄位',
        'any.only': '"性別" 必須是 0 或 1'  // 性別為 0 或 1
    }),  // 性別
    exerciseFrequency: Joi.number().valid(0, 1, 2).required().messages({
        'number.base': '"運動頻率" 必須是數字',
        'any.required': '"運動頻率" 為必填欄位',
        'any.only': '"運動頻率" 必須是 0 (不運動)、1 (偶爾運動) 或 2 (經常運動)'  // 自訂友善錯誤訊息
    })  // 運動頻率
});


// 計算年齡
function calculateAge(birthDate) {
    const birthYear = moment(birthDate).year();
    const currentYear = moment().year();
    return currentYear - birthYear;
}

// 計算基礎代謝率 (BMR)
function calculateBMR(height, weight, age, gender) {
    let bmr;
    if (gender === 0) {  // 男性
        bmr = weight * 10 + height * 6.25 - age * 5 + 5;
    } else {  // 女性
        bmr = weight * 10 + height * 6.25 - age * 5 - 161;
    }
    return bmr;
}

// 創建使用者資料控制器
const createUserData = async (req, res) => {
    const { userID, birthDate, height, weight, gender, exerciseFrequency } = req.body;

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

        // 確保日期是有效且符合 ISO 格式
        const formattedBirthDate = moment(birthDate, 'YYYY-MM-DD', true).isValid() ? moment(birthDate).toISOString() : null;
        if (!formattedBirthDate) {
            return res.status(400).json({ message: '"出生日期" 格式錯誤，必須是 ISO 8601 格式 (例如: YYYY-MM-DD)' });
        }

        // 資料驗證
        const { error } = createUserDataModel.validate(req.body);
        if (error) {
            return res.status(400).json({ message: `驗證錯誤: ${error.details[0].message}` });
        }

        // 計算年齡和基礎代謝率
        const age = calculateAge(birthDate);
        const bmr = calculateBMR(height, weight, age, gender);

        // 建立並儲存使用者資料
        const userData = new UserData({
            userID,
            birthDate,
            height,
            weight,
            gender,
            exerciseFrequency,
            bmr,
            age
        });

        await userData.save();

        res.status(200).json({ message: '成功建立使用者資料' });
    } catch (err) {
        console.error('錯誤:', err);  
        res.status(500).json({ message: '伺服器錯誤', error: err.message });
    }
};

module.exports = { createUserData };

