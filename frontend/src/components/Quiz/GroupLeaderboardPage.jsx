// src/components/GroupLeaderboard.jsx
import React from "react";

export default function GroupLeaderboard({ group }) {
  if (!group?.leaderboard?.length) {
    return <p className="text-slate-500">No leaderboard yet</p>;
  }

  return (
    <div className="space-y-4">
      {group.leaderboard.map((p, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";

        return (
          <div
            key={p.user}
            className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex justify-between"
          >
            <div className="flex items-center gap-3">
              {medal && <span className="text-xl">{medal}</span>}
              <span className="font-medium text-slate-900 dark:text-white">
                {i + 1}. {p.name}
              </span>
            </div>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {p.score} pts
            </span>
          </div>
        );
      })}
    </div>
  );
}
