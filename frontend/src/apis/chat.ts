import { Axios } from "./axios";

export const getChatRecords = async (email: string, timestamp?: number) => {
  try {
    const response = await Axios.get(
      `/api/chat/getChatRecords?email=${email}&timestamp=${timestamp || ""}`
    );

    return response.data;
  } catch (error) {
    console.error("Error getting chat records:", error);

    return null;
  }
};

export const chatWithBot = async (userId: string, message: string) => {
  try {
    const response = await Axios.post(`/chatWithBot`, {
      user_id: userId,
      query_text: message,
    });

    return response.data;
  } catch (error) {
    console.error("Error chatting with bot:", error);

    return null;
  }
};

// 獲取飲食建議
export const generateRecommendation = async (
  mealInfo: {
    whichMeal: string;
    mealTime: string;
    foodContent: { foodName: string; weightInGram: number; calories: number }[];
    calories: number;
  }
) => {
  try {
    const response = await Axios.post(`/api/chat/generateRecommendation`, {
      ...mealInfo
    });

    return response.data.suggestion;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    return null;
  }
};
