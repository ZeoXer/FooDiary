import { Axios } from "./axios";

export const signup = async (
  userName: string,
  email: string,
  password: string
) => {
  try {
    const response = await Axios.post("/api/auth/signup", {
      userName,
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error logging in:", error);

    if (error.response) {
      return error.response.data;
    }

    return { message: "登入過程中發生錯誤，請稍後再試" };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await Axios.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error logging in:", error);

    if (error.response) {
      return error.response.data;
    }

    return { message: "登入過程中發生錯誤，請稍後再試" };
  }
};

export const forgetPassword = async (email: string) => {
  try {
    const response = await Axios.post("/api/auth/forgetPassword", { email });

    return response.data;
  } catch (error: any) {
    console.error("Error forgetting password:", error);

    if (error.response) {
      return error.response.data;
    }

    return { message: "重設密碼過程中發生錯誤，請稍後再試" };
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await Axios.post("/api/auth/resetPassword", {
      token,
      newPassword,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error resetting password:", error);

    if (error.response) {
      return error.response.data;
    }

    return { message: "重設密碼過程中發生錯誤，請稍後再試" };
  }
};
