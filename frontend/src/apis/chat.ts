import { Axios } from "./axios";

export const getChatRecords = async (userId: string, timestamp?: number) => {
  try {
    const response = await Axios.get(
      `/getChatRecords/${userId}?timestamp=${timestamp || ""}`
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
