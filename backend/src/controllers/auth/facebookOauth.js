const axios = require('axios');
const { User } = require('../../models/user');
const { generateToken } = require("../../config/jwt");
const REDIRECT_URI = `${process.env.HOST_URL}/api/auth/facebook/callback`;

APP_ID = process.env.FACEBOOK_APP_ID;
APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const facebookLogin = async (req, res) => {
    const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile`;
    res.redirect(url);
};

// 接收 Facebook 回傳的資料
const facebookCallback = async (req, res) => {

    // Facebook 給的授權碼
    const { code } = req.query;

    const data = {
        code,
        client_id: APP_ID,
        client_secret: APP_SECRET,
        redirect_uri: REDIRECT_URI,
    };

    try {
        // exchange authorization code for access token
        const response = await axios.post('https://graph.facebook.com/v13.0/oauth/access_token', null, {
            params: data,
        });
        const { access_token } = response.data;

        // Use access_token to fetch user profile
        const userInfoResponse = await axios.get('https://graph.facebook.com/me', {
            params: {
                access_token,
                fields: 'id,name,email',
            }
        });

        const userInfo = userInfoResponse.data;
        const { email, name, id } = userInfo;

        // 檢查用戶是否存在
        let user = await User.findOne({ email: email }).select("-password");
        if (!user) {
            user = await User.create({ userName: name, email, password: id });
        }

        const token = generateToken();
        res.status(200).json({ user, token });

    } catch (error) {
        res.status(500).send('Error with authenticating with Facebook');
    }
};

module.exports = {
    facebookLogin,
    facebookCallback,
};