// client/src/api/axiosInstance.js
import axios from "axios";

// Base URL from Vite env or fallback for dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally (e.g., auto-logout)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear storage and send to login
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;