// src/components/GroupLeaderboard.jsx
import React from "react";

export default function GroupLeaderboard({ leaderboard = [] }) {
  if (!leaderboard.length) {
    return (
      <p className="text-gray-500 dark:text-gray-300 text-center py-4">
        No leaderboard yet
      </p>
    );
  }

  // Sort by score (highest first)
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      {sorted.map((p, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";

        const percent =
          sorted[0].score > 0
            ? Math.round((p.score / sorted[0].score) * 100)
            : 0;

        return (
          <div
            key={i}
            className={`p-5 rounded-xl border shadow-sm dark:border-gray-700
              bg-white dark:bg-gray-900 relative overflow-hidden`}
          >
            {/* Score Progress Bar */}
            <div
              className="absolute left-0 top-0 h-full bg-indigo-200/40 dark:bg-indigo-500/20 transition-all"
              style={{ width: `${percent}%` }}
            ></div>

            {/* Content */}
            <div className="relative z-10 flex justify-between items-center">
              {/* Left section: medal + name */}
              <div className="flex items-center gap-3">
                {medal && <span className="text-2xl select-none">{medal}</span>}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {i + 1}. {p.name}
                </span>
              </div>

              {/* Right section: score */}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {p.score} pts
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
