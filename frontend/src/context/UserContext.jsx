import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const setToken = (token) => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  };

  const login = ({ user: u, token }) => {
    setUser(u || null);
    setToken(token || null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = () => !!localStorage.getItem("token");

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
