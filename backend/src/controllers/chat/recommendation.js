const apiService = require("../../services/RAGService");

// 處理飲食建議
const recommendationController = {
  generateRecommendation: async (req, res) => {
    const { whichMeal, mealTime, foodContent, calories } = req.body;
    let userID = req.user.userID;
    userID = userID.toString();

    if (
      !whichMeal ||
      !mealTime ||
      !Array.isArray(foodContent) ||
      foodContent.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    // 組合食物資訊生成查詢文本
    let queryText = `根據以下餐點資訊：\n`;
    queryText += `餐點類型: ${whichMeal}\n總卡路里: ${calories}\n食物內容:\n`;

    foodContent.forEach((food) => {
      const { foodName, weightInGram, calories } = food;
      queryText += `- ${foodName}: ${weightInGram} 克, ${calories} 卡路里\n`;
    });

    queryText += `不要參考過去的對話紀錄，僅根據這些餐點提供飲食建議，包括食物內容的健康程度、熱量控制等，給出詳細的分析和改進的建議。`;

    try {
      console.log(userID, queryText);
      const recommendation = await apiService.chatWithBot(userID, queryText);

      return res.json({
        success: true,
        suggestion: recommendation,
      });
    } catch (err) {
      console.error("Error generating recommendation:", err.message);
      return res.status(500).json({
        success: false,
        message: "Generate recommendation failed: " + err.message,
      });
    }
  },
};

module.exports = recommendationController;
