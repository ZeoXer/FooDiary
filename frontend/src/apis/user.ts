import { Axios } from "./axios";

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

export const getUserData = async () => {
  try {
    const response = await Axios.get("/api/user/getUserData");

    return response.data;
  } catch (error) {
    console.error("Error getting user data:", error);

    return null;
  }
};
