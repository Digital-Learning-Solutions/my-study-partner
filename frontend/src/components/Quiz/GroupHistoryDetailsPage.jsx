// src/components/GroupHistoryDetails.jsx
import React from "react";

export default function GroupHistoryDetails({ historyItem, goBack }) {
  if (!historyItem)
    return <p className="text-center text-red-500 mt-4">History not found</p>;

  const sortedResults = [...historyItem.results].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="space-y-8">
      {/* BACK BUTTON */}
      <button
        onClick={goBack}
        className="px-3 py-1 mb-4 text-sm rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl font-bold dark:text-white">Game Details</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Played on: {new Date(historyItem.playedAt).toLocaleString()}
        </p>
      </div>

      {/* RESULTS */}
      <div>
        <h2 className="text-xl font-semibold dark:text-white mb-4">Results</h2>

        <div className="space-y-3">
          {sortedResults.map((r, index) => (
            <div
              key={index}
              className="p-4 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
            >
              <span className="font-medium dark:text-white">
                {index + 1}. {r.name}
              </span>

              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {r.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* QUESTION BREAKDOWN REMOVED — not in schema */}
      <div className="mt-10 p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-300">
          Question details are not stored in this version of the system.
        </p>
      </div>
    </div>
  );
}
