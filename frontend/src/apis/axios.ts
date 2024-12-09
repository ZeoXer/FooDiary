import axios from "axios";

export const Axios = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
