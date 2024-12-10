import { Axios } from "./axios";

export const signup = async (email: string, password: string) => {
  try {
    const response = await Axios.post("/signup", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);

    return null;
  }
};
