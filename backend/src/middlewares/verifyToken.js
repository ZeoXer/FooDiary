require('dotenv').config();

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // 確保 Token 存在

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token.' });
            }

            // 檢查演算法是否正確（HS256）
            if (decoded && decoded.header && decoded.header.alg !== 'HS256') {
                return res.status(403).json({ error: 'Invalid token algorithm.' });
            }

            req.user = decoded; // 將解碼後的資料存入 req.user
            next();
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { verifyToken };


