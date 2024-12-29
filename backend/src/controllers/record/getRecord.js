const { Record } = require("../../models/record");

// 獲取飲食紀錄
const getRecord = async (req, res) => {
  const { startDate, endDate } = req.query;
  const userID = req.user.userID;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const records = await Record.find({
      userID,
      mealTime: { $gte: start, $lt: end },
    });

    return res.status(200).json(records);
  } catch (err) {
    console.error("獲取紀錄時出現錯誤:", err);
    return res.status(500).json({ message: "伺服器錯誤", error: err.message });
  }
};

module.exports = { getRecord };
