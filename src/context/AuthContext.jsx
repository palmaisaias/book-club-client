import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userName, setUserName] = useState(() => localStorage.getItem("username"));

  // On login/signup, store token + username
  const login = async (username, password) => {
    // build URL-encoded form data
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);

    try {
      // Axios POST with form data
      const response = await api.post("/auth/login", form.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const { access_token } = response.data;
      setToken(access_token);
      setUserName(username);
      localStorage.setItem("token", access_token);
      localStorage.setItem("username", username);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err);
      throw new Error("Login failed");
    }
  };

  const signup = async (username, password) => {
    try {
      // JSON POST for signup
      await api.post("/auth/signup", { username, password });
      // auto-login after signup
      await login(username, password);
    } catch (err) {
      const detail = err.response?.data?.detail;
      console.error("Signup failed:", err.response?.data || err);
      throw new Error(detail || "Signup failed");
    }
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Auto-logout after 30 minutes (token expiry)
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      logout();
    }, 30 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, userName, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}