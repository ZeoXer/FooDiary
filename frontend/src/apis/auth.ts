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
  } catch (error) {
    console.error("Error signing up:", error);

    return null;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await Axios.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);

    return null;
  }
};
