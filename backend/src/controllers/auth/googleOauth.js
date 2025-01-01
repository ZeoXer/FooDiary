const axios = require('axios');
const { User } = require('../../models/user');
const { generateToken } = require("../../config/jwt");
const GOOGLE_CALLBACK_URL = `${process.env.HOST_URL}/api/auth/google/callback`;

// 向 Google 拿取 email, name 的設定
const GOOGLE_OAUTH_SCOPES = [
    "https%3A//www.googleapis.com/auth/userinfo.email",
    "https%3A//www.googleapis.com/auth/userinfo.profile",
];

const googleLogin = async (req, res) => {
    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
};

// 接收 Google 回傳的資料
const googleCallback = async (req, res) => {
    
    // Google 給的授權碼
    // console.log(req.query);
    const { code } = req.query;

    const data = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
    };
    // console.log(data);

    try {
        // exchange authorization code for access token & id_token
        const response = await axios.post(process.env.GOOGLE_ACCESS_TOKEN_URL, data);
        const { id_token } = response.data;
        // console.log(id_token);

        // verify and extract the information in the id token
        const tokenInfoResponse = await axios.get(`${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`);
        const tokenInfoData = tokenInfoResponse.data;

        // 檢查用戶是否存在
        const { email, name } = tokenInfoData;
        let user = await User.findOne({ email }).select("-password");
        if (!user) {
            user = await User.createUser({ email, name });
        }

        const token = generateToken();
        res.status(tokenInfoResponse.status).json({ user, token });

    } catch (error) {
        res.status(500).send('Error while authenticating with Google');
    }
};

module.exports = {
    googleLogin,
    googleCallback,
};