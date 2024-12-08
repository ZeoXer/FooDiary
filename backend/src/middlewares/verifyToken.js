require('dotenv').config();

const jwt = require('jsonwebtoken');
const { User } = require('../models/user'); 
const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // 確保 Token 存在

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired.' });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(403).json({ error: 'Invalid token.' });
                }
                return res.status(403).json({ error: 'Token verification failed.' });
            }

            // 根據 userID 查找用戶
            const user = await User.findById(decoded.userID); 
            if (!user) {
                return res.status(403).json({ error: 'User not found.' });
            }

            req.user = decoded; // 將解碼後的資料存入 req.user
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { verifyToken };



