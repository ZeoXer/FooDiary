const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 定義 User Schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, '請提供有效的 Email 地址']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

// 密碼加密
userSchema.methods.hashPassword = async function (password) {
    this.password = await bcrypt.hash(password, 10);
};

// 建立新用戶
userSchema.statics.createUser = async function ({ userName, email, password }) {
    const existingUser = await this.findOne({ email });
    if (existingUser) throw new Error('用戶已經存在');

    const newUser = new this({ userName, email });
    await newUser.hashPassword(password);  
    await newUser.save();
    return 0
};


const User = mongoose.model('User', userSchema);


module.exports = { User };



