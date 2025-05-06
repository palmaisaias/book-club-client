// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || null);

  // --- LOGIN ---
  const login = async (username, password) => {
    // Build form data correctly
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);

    console.log("🔑 login(): sending form", form.toString());
    try {
      const response = await api.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      console.log("✅ login response:", response.data);

      const { access_token } = response.data;
      setToken(access_token);
      setUserName(username);
      localStorage.setItem("token", access_token);
      localStorage.setItem("userName", username);
    } catch (err) {
      console.error("❌ login failed:", err.response?.data || err);
      // surface the backend detail if present
      const detail = err.response?.data?.detail;
      throw new Error(detail || "Login failed");
    }
  };

  // --- SIGNUP ---
  const signup = async (username, password) => {
    console.log("📝 signup(): payload", { username, password });
    try {
      const response = await api.post("/auth/signup", { username, password });
      console.log("✅ signup response:", response.data);

      // automatically log in after successful signup
      await login(username, password);
    } catch (err) {
      console.error("❌ signup failed:", err.response?.data || err);
      const detail = err.response?.data?.detail;
      throw new Error(detail || "Signup failed");
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setToken(null);
    setUserName(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  // --- AUTO-LOGOUT after 30m ---
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(logout, 30 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, userName, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}