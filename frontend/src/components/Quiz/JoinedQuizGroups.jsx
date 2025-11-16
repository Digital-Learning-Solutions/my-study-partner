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
      } finally {
        setLoading(false);
      }
    }
    if (userId) load();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Joined Groups</h2>

      {loading ? (
        <div className="grid gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-300 dark:bg-gray-700 rounded-xl"
            ></div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div
          className="
          text-center bg-white/50 dark:bg-gray-800/60 
          p-6 rounded-xl shadow backdrop-blur-xl
        "
        >
          <p className="text-gray-600 dark:text-gray-300">
            You haven't joined any groups yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {groups.map((g) => (
            <div
              key={g._id}
              className="
                p-5 rounded-xl bg-white dark:bg-gray-800 
                shadow hover:shadow-xl transition hover:scale-[1.02]
              "
            >
              <h3 className="font-bold text-lg dark:text-white">{g.name}</h3>
              <p className="text-gray-500 dark:text-gray-300">
                {g.description || "No description"}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/quiz/multiplayer/quiz-groups/${g._id}`)
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Open
                </button>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/quiz/multiplayer/quiz-groups/${g._id}`
                    )
                  }
                  className="px-4 py-2 border dark:border-gray-600 rounded-lg dark:text-white"
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
