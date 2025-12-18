import axios from "axios";
import { SERVER_URL, getToken, getTokenType } from "./config";

const baseURL = (SERVER_URL || "").replace(/\/$/, "");

const http = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

http.interceptors.request.use((config: any) => {
  const token = getToken();
  if (token) {
    const type = getTokenType();
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `${type} ${token}`;
  }
  return config;
});

export default http;
