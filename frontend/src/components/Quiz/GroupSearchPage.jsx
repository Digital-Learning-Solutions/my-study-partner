// src/pages/GroupSearchPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GroupSearchPage() {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInitial() {
      await loadGroups("");
    }
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadGroups(searchTerm) {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/quiz-groups?search=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await res.json();
      setGroups(data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold mb-4 text-white">Find Groups</h2>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          loadGroups(e.target.value);
        }}
        placeholder="Search group by name..."
        className="
          w-full p-4 rounded-2xl placeholder:text-[#94a3b8]
          bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]
          focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 text-white
        "
      />

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl flex items-center gap-4"
              style={{
                minHeight: "80px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div className="w-12 h-12 rounded-full bg-[#111827]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-[#111827] rounded" />
                <div className="h-3 w-2/3 bg-[#0b1220] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map((i) => {
            const g = groups[i];

            return (
              <div
                key={i}
                className={`rounded-2xl flex items-center gap-4 transition transform-gpu ${
                  g
                    ? "p-4 bg-[linear-gradient(90deg,rgba(255,255,255,0.02),rgba(124,58,237,0.02))] border border-[rgba(255,255,255,0.03)] hover:scale-[1.01] shadow-[0_8px_30px_rgba(124,58,237,0.06)]"
                    : ""
                }`}
                style={{ minHeight: "80px" }}
              >
                {g ? (
                  <>
                    <div
                      className="
                        w-12 h-12 flex items-center justify-center rounded-full
                        bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] font-bold text-white
                      "
                    >
                      {g.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white">{g.name}</h4>
                      <p className="text-sm text-[#9ca3af]">
                        {g.description || "No description"}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/quiz/multiplayer/quiz-groups/${g._id}`)
                      }
                      className="
                        px-4 py-2 rounded-lg text-white font-semibold
                        bg-[linear-gradient(90deg,#06b6d4,#7c3aed)]
                        shadow-[0_8px_30px_rgba(6,182,212,0.12)]
                        hover:scale-[1.03] transition transform-gpu
                      "
                    >
                      View
                    </button>
                  </>
                ) : (
                  <div className="opacity-0 w-full h-full" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
