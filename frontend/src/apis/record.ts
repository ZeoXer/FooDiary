import { Axios } from "./axios";

// 新增用餐紀錄
export const addMealRecord = async (data: {
  mealTime: string; 
  whichMeal: string;
  foodContent: Array<{ foodName: string; weightInGram: number; calories: number }>; 
  calories: number; 
  suggestion: string;
}) => {
  try {
    const response = await Axios.post("/api/record/addRecord", data);
    return response.data;
  } catch (error) {
    console.error("Error adding meal record:", error);
    return null;
  }
};

// 刪除用餐紀錄
export const deleteMealRecord = async (data: {
  recordID: string; 
}) => {
  try {
    const response = await Axios.delete("/api/record/deleteRecord", { data });
    return response.data;
  } catch (error) {
    console.error("Error deleting meal record:", error);
    return null;
  }
};

// 編輯用餐紀錄
export const editMealRecord = async (data: {
  recordID: string; 
  foodContent: Array<{ foodName: string; weightInGram: number; calories: number }>; 
}) => {
  try {

    const response = await Axios.put("/api/record/editRecord", data );
    return response.data;
  } catch (error) {
    console.error("Error editing meal record:", error);
    return null;
  }
};


// 獲取卡路里數據
export const getCalories = async (data: {
  startDate: string; 
  endDate: string; 
}) => {
  try {
    const response = await Axios.get("/api/record/getCalories", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching calories data:", error);
    return null;
  }
};

// 獲取飲食紀錄
export const getMealRecord = async (data: {
  date: string; 
}) => {
  try {
    const response = await Axios.get("/api/record/getRecord", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching meal record:", error);
    return null;
  }
};


// 獲取單日飲食紀錄
export const getSingleMealRecord = async (data: {
  date: string;
}) => {
  try {
    const response = await Axios.get("/api/record/getSingleRecord", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching single meal record:", error);
    return null;
  }
};
