// src/components/Quiz/CreateQuizGroup.jsx
import React, { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
      const res = await fetch(`${BACKEND_URL}/api/quiz-groups`, {
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
      alert("Failed to create group. See console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        p-6 rounded-2xl
        bg-[linear-gradient(135deg,rgba(99,102,241,0.08),rgba(236,72,153,0.06))]
        border border-[rgba(255,255,255,0.04)]
        shadow-[0_20px_60px_rgba(99,102,241,0.08)]
        backdrop-blur-lg
      "
    >
      <h2 className="text-2xl font-extrabold mb-4 text-white">
        Create a Quiz Group
      </h2>

      <div className="space-y-3">
        <input
          className="w-full p-3 rounded-xl placeholder:text-[#94a3b8] bg-[rgba(0,0,0,0.25)] border border-[rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 text-white"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-3 rounded-xl placeholder:text-[#94a3b8] bg-[rgba(0,0,0,0.25)] border border-[rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 text-white"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className={`w-full py-3 rounded-2xl font-semibold text-white transition transform-gpu ${
            loading
              ? "opacity-60 cursor-not-allowed bg-[linear-gradient(90deg,#9ca3ff,#fbcfe8)]"
              : "bg-[linear-gradient(90deg,#06b6d4,#7c3aed)] hover:scale-[1.02] shadow-[0_12px_40px_rgba(124,58,237,0.12)]"
          }`}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
}
