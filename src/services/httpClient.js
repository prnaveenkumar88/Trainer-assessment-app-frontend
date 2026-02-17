import axios from "axios";
import { clearAuth } from "../utils/auth";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const httpClient = axios.create({
  baseURL: API_BASE_URL,
});

// attach token to every request
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const isLoginCall =
      typeof requestUrl === "string" && requestUrl.includes("/auth/login");

    if (status === 401 && !isLoginCall) {
      clearAuth();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/"
      ) {
        window.location.assign("/");
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
