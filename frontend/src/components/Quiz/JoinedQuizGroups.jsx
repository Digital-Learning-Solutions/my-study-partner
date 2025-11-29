// src/components/Quiz/JoinedQuizGroups.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinedQuizGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/quiz-groups/mine?userId=${userId}`
        );
        const data = await res.json();
        setGroups(data.groups || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) load();
  }, [userId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">Joined Groups</h2>

      {loading ? (
        <div className="grid gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-gradient-to-r from-[#111827] to-[#0b1220] border border-[rgba(255,255,255,0.02)]"
            ></div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center p-6 rounded-2xl bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(59,130,246,0.06))] border border-[rgba(255,255,255,0.04)]">
          <p className="text-[#cbd5e1]">You haven't joined any groups yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {groups.map((g) => (
            <div
              key={g._id}
              className="
                p-5 rounded-2xl flex flex-col justify-between
                bg-gradient-to-br from-[#0f1724] to-[#070b17]
                border border-[rgba(255,255,255,0.05)]
                shadow-[0_10px_35px_rgba(124,58,237,0.10)]
                hover:scale-[1.02] transition transform-gpu
                min-h-[170px]
              "
            >
              {/* TOP: Group Info */}
              <div className="">
                <h3 className="font-bold text-lg text-white">{g.name}</h3>
                <p className="text-sm text-[#9ca3af] mt-1 line-clamp-3">
                  {g.description || "No description"}
                </p>
              </div>

              {/* BOTTOM: Buttons */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  onClick={() =>
                    navigate(`/quiz/multiplayer/quiz-groups/${g._id}`)
                  }
                  className="
                    flex-1 py-2 rounded-xl text-sm font-semibold text-white
                    bg-[linear-gradient(90deg,#06b6d4,#7c3aed)]
                    shadow-[0_8px_25px_rgba(6,182,212,0.18)]
                    hover:scale-[1.03] transition transform-gpu
                  "
                >
                  Open
                </button>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/quiz/multiplayer/quiz-groups/${g._id}`
                    )
                  }
                  className="
                    px-4 py-2 rounded-xl text-sm text-[#cbd5e1]
                    border border-[rgba(255,255,255,0.10)]
                    hover:bg-[rgba(255,255,255,0.04)] transition
                  "
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
