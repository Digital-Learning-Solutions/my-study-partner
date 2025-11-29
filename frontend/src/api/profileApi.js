// src/api/profileApi.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const API_BASE = `${BACKEND_URL}/api/user`;

export const profileApi = {
  // ✅ Update user profile
  updateProfile: async (userId, form) => {
    try {
      const res = await fetch(`${API_BASE}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return await res.json();
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  },
};
