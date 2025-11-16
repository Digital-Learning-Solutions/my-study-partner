import React, { useState, useEffect } from "react";
import { StoredContext } from "./StoredContext.jsx";

export const StoredProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getUser();
  }, []);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userId = localStorage.getItem("userId");

      const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        console.log("Fetched user:", data.user);
      } else {
        console.warn("Failed to fetch user:", data.message);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  return (
    <StoredContext.Provider value={{ user, setUser, getUser }}>
      {children}
    </StoredContext.Provider>
  );
};
