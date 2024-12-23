const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
const SECRET_KEY = JWT_SECRET;  

function generateToken(user) {
    const payload = {
        userID: user._id,       
        userName: user.userName, 
    };

    const options = {
        expiresIn: JWT_EXPIRES_IN, 
        algorithm: 'HS256',        
    };

    const token = jwt.sign(payload, SECRET_KEY, options); 
    return token;
}

// 驗證 JWT
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded; 
    } catch (err) {
        return null; 
    }
}

// 解碼 JWT
function decodeToken(token) {
    const decoded = jwt.decode(token); 
    return decoded;
}



module.exports = {
    generateToken,
    // verifyToken,
    // decodeToken
};
