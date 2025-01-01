const { User } = require("../../models/user");
const { createToken } = require("../../config/tmpToken");
const { sesClient } = require("../../config/mail");
const { redisClient } = require("../../config/redis");

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  // 檢查是否提供有電子郵件
  if (!email) {
    return res.status(400).json({ message: "請提供電子郵件" });
  }

  // 檢查用戶是否存在
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "用戶不存在，請註冊帳號" });
  }

  // 建立臨時 token
  const token = await createToken();
  const item = JSON.stringify({
    email,
    token,
  });

  // 存入 Redis 中，並且設定 1 小時自動銷毀（EX = expired）
  redisClient.set(`PASSWORD:RESET:${token}`, item, "EX", 3600);

  // 從 AWS SES 寄信
  try {
    // email 參數
    const emailParams = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<a href='${process.env.HOST_URL}/reset-password?token=${token}'>請點此重設密碼</a>`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Password Reset",
        },
      },
      Source: "forgetPassword@ching11720.site",
    };

    // 使用 SES 發送郵件
    await sesClient.sendEmail(emailParams).promise();

    res.status(200).json({ message: "已寄出重設密碼信件" });
  } catch (error) {
    console.error("Email sending failed", error);
    res.status(500).json({ message: "郵件發送失敗，請稍後再試" });
  }
};

module.exports = { forgetPassword };