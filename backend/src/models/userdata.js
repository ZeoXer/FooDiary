const mongoose = require('mongoose');
const moment = require('moment');
const { User } = require('./user');

// 定義 UserData Schema
const userDataSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // 引用 User Schema
        required: true 
    },
    birthDate: { type: Date, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    gender: { type: Number, required: true, enum: [0, 1] },
    exerciseFrequency: { type: Number, required: true, enum: [0, 1, 2] },
    bmr: { type: Number, required: true },
    age: { type: Number, required: true }
});

// 計算年齡
userDataSchema.methods.calculateAge = function() {
    const birthYear = moment(this.birthDate).year();
    const currentYear = moment().year();
    return currentYear - birthYear;
};

// 計算基礎代謝率 (BMR)
userDataSchema.methods.calculateBMR = function() {
    const age = this.calculateAge();
    let bmr;
    if (this.gender === 0) { // 男性
        bmr = this.weight * 10 + this.height * 6.25 - age * 5 + 5;
    } else { // 女性
        bmr = this.weight * 10 + this.height * 6.25 - age * 5 - 161;
    }
    return bmr;
};

// 在保存資料時計算 BMR 和年齡
userDataSchema.pre('save', function(next) {
    this.age = this.calculateAge();
    this.bmr = this.calculateBMR();
    next();
});

// 用於創建 UserData
userDataSchema.statics.createUserData = async function({ userID, birthDate, height, weight, gender, exerciseFrequency }) {
    const userData = new this({ userID, birthDate, height, weight, gender, exerciseFrequency });
    await userData.save();
    return userData;
};

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = { UserData };

