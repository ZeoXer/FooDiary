import { Axios } from "./axios";

// 新增使用者資料
export const createUserData = async (data: {
  birthDate: string;
  height: number;
  weight: number;
  gender: number;
  exerciseFrequency: number;
}) => {
  try {
    const response = await Axios.post("/api/user/createUserData", data);

    return response.data;
  } catch (error) {
    console.error("Error creating user data:", error);

    return null;
  }
};

// 獲取使用者資料
export const getUserData = async () => {
  try {
    const response = await Axios.get("/api/user/getUserData");

    return response.data;
  } catch (error) {
    console.error("Error getting user data:", error);

    return null;
  }
};

// 更新使用者資料
export const editUserData = async (data: {
  userName: string;
  birthDate: string;
  height: number;
  weight: number;
  gender: number;
  exerciseFrequency: number;
}) => {
  try {
    const response = await Axios.put("/api/user/editUserData", data);

    return response.data;
  } catch (error) {
    console.error("Error editing user data:", error);

    return null;
  }
};

// 更新密碼
export const updatePassword = async (data: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await Axios.put("/api/user/updatePassword", data);

    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);

    return null;
  }
};

// 刪除使用者
export const deleteUser = async () => {
  try {
    const response = await Axios.delete("/api/user/deleteUser");

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);

    return null;
  }
};
