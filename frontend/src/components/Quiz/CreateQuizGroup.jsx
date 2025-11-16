// src/components/Quiz/CreateQuizGroup.jsx
import React, { useState } from "react";

export default function CreateQuizGroup({ onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  async function handleCreate() {
    if (!name.trim()) return alert("Enter group name");

    const payload = { userId, name, description };
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/quiz-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) return alert(data?.message || "Error creating group");

      alert("Group created!");
      onCreated(data.group._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
      bg-white/50 dark:bg-gray-800/60 
      p-6 rounded-2xl shadow-xl backdrop-blur-xl 
      border border-white/30 dark:border-gray-700
    "
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Create a Quiz Group
      </h2>

      <div className="space-y-3">
        <input
          className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:text-white"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:text-white"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="
            w-full py-3 rounded-xl text-white font-semibold
            bg-indigo-600 hover:bg-indigo-700
            disabled:bg-indigo-300 transition
          "
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
}
