import React, { createContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userName, setUserName] = useState(() => localStorage.getItem("username"));

  // On login/signup, store token + username
  const login = async (username, password) => {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!res.ok) throw new Error("Login failed");
    const { access_token } = await res.json();
    setToken(access_token);
    setUserName(username);
    localStorage.setItem("token", access_token);
    localStorage.setItem("username", username);
  };

  const signup = async (username, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Signup failed");
    }
    // auto-login after signup
    await login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ token, userName, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}