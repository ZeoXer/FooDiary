// const jwt = require('jsonwebtoken');
// const { User } = require('../models/userModel');  
// const config = require('../config/jwt');  

// // JWT 驗證 middleware
// const authMiddleware = async (req, res, next) => {
//     try {

//         const token = req.header('Authorization')?.replace('Bearer ', ''); 
//         if (!token) {
//             return res.status(401).json({ message: '未提供驗證 Token' });
//         }

//         const decoded = jwt.verify(token, config.JWT_SECRET);
//         const user = await User.findById(decoded.userId);  

//         if (!user) {
//             return res.status(401).json({ message: '用戶不存在' });
//         }
//         req.user = user;

//         next();
//     } catch (error) {

//         return res.status(401).json({ message: '無效的 Token 或授權失敗' });
//     }
// };

// module.exports = authMiddleware;
