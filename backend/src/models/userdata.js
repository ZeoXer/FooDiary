const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('joi');

// 定義 UserData Schema
const userDataSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    birthDate: { type: Date, required: true },
    height: { type: Number, required: true }, // 單位：cm
    weight: { type: Number, required: true }, // 單位：kg
    gender: { type: Number, required: true, enum: [0, 1] }, // 0: 男性, 1: 女性
    exerciseFrequency: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3, 4, 5, 6, 7], // 每週最多運動 7 天
    },
    bmr: { type: Number },
    age: { type: Number }
});

// 計算年齡
userDataSchema.methods.calculateAge = function () {
    const birthYear = moment(this.birthDate).year();
    const currentYear = moment().year();
    return currentYear - birthYear;
};

// 計算基礎代謝率 (BMR)
userDataSchema.methods.calculateBMR = function () {
    const age = this.calculateAge();
    return this.gender === 0
        ? this.weight * 10 + this.height * 6.25 - age * 5 + 5 // 男性公式
        : this.weight * 10 + this.height * 6.25 - age * 5 - 161; // 女性公式
};

// 在保存資料時自動計算 BMR 和年齡
userDataSchema.pre('save', function (next) {
    this.age = this.calculateAge();
    this.bmr = this.calculateBMR();
    next();
});

// 靜態方法：建立 UserData
userDataSchema.statics.createUserData = async function ({ userID, birthDate, height, weight, gender, exerciseFrequency }) {
    const userData = new this({ userID, birthDate, height, weight, gender, exerciseFrequency });
    await userData.save();
    return userData;
};

// Joi 驗證模型
const UserDataModel = Joi.object({
    birthDate: Joi.date().iso().required().messages({
        'date.base': '"出生日期" 必須是有效的日期格式',
        'date.isoDate': '"出生日期" 必須符合 ISO 8601 格式 (例如: YYYY-MM-DD)',
        'any.required': '"出生日期" 為必填欄位'
    }),
    height: Joi.number().positive().required().messages({
        'number.base': '"身高" 必須是正數',
        'any.required': '"身高" 為必填欄位'
    }),
    weight: Joi.number().positive().required().messages({
        'number.base': '"體重" 必須是正數',
        'any.required': '"體重" 為必填欄位'
    }),
    gender: Joi.number().valid(0, 1).required().messages({
        'number.base': '"性別" 必須是數字',
        'any.required': '"性別" 為必填欄位',
        'any.only': '"性別" 必須是 0 或 1'
    }),
    exerciseFrequency: Joi.number().valid(0, 1, 2, 3, 4, 5, 6, 7).required().messages({
        'number.base': '"運動頻率" 必須是數字',
        'any.required': '"運動頻率" 為必填欄位',
        'any.only': '"運動頻率" 必須是 一週 0 ~ 7 次'
    })
});

// 建立模型
const UserData = mongoose.model('UserData', userDataSchema);

// 導出
module.exports = { UserData, UserDataModel };



