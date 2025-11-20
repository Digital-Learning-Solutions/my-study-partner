
// src/context/useStoredContext.jsx
import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { StoredContext } from "./StoredContext.jsx";

export function StoredProvider({ children }) {
  const [user, setUser] = useState(null);
  const [saaraOpen, setSaaraOpen] = useState(false);
  const [saaraPrompt, setSaaraPrompt] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || "http://localhost:5000/api";

  const getUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return null;
      }

      const userId = localStorage.getItem("userId");
      setLoading(true);
      const url = userId ? `${API_BASE.replace(/\/$/,"")}/user/${userId}` : `${API_BASE.replace(/\/$/,"")}/user/me`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        return null;
      }

      const data = await res.json();
      if (res.ok && data?.user) {
        setUser(data.user);
        try {
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (err) {}
        return data.user;
      }

      setUser(null);
      return null;
    } catch (err) {
      console.error("getUser error", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const setUserAndStore = useCallback((u) => {
    try {
      if (u) localStorage.setItem("user", JSON.stringify(u));
      else localStorage.removeItem("user");
    } catch (err) {
      console.error("persist user", err);
    }
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
    } catch (err) {}
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getUser();
    else setLoading(false);
  }, [getUser]);

  const value = useMemo(
    () => ({
      user,
      setUser: setUserAndStore,
      getUser,
      logout,
      loading,
      saaraOpen,
      setSaaraOpen,
      saaraPrompt,
      setSaaraPrompt,
    }),
    [user, setUserAndStore, getUser, logout, loading, saaraOpen, saaraPrompt]
  );

  return <StoredContext.Provider value={value}>{children}</StoredContext.Provider>;
}

export function useStoredContext() {
  const ctx = useContext(StoredContext);
  if (ctx === null) {
    throw new Error("useStoredContext must be used within StoredProvider. Wrap your app with <StoredProvider>.");
  }
  return ctx;
}
