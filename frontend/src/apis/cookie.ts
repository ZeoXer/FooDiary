import Cookies from "js-cookie";

export const setAuthToken = (token: string) => {
  Cookies.set("authToken", token);
};

export const getAuthToken = () => {
  return Cookies.get("authToken");
};

export const removeAuthToken = () => {
  Cookies.remove("authToken");
};
