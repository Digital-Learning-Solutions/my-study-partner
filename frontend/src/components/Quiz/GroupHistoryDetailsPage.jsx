// src/components/GroupHistoryDetails.jsx
import React from "react";

export default function GroupHistoryDetails({ historyItem, goBack }) {
  if (!historyItem)
    return <p className="text-center text-red-500 mt-4">History not found</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="px-3 py-1 mb-4 text-sm rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold dark:text-white text-center">
        Game Details
      </h1>

      <p className="text-center text-slate-500 dark:text-gray-400">
        Played on: {new Date(historyItem.playedAt).toLocaleString()}
      </p>

      {/* RESULTS */}
      <div>
        <h2 className="text-xl font-semibold dark:text-white">Results</h2>

        <div className="mt-4 space-y-3">
          {historyItem.results
            .sort((a, b) => b.score - a.score)
            .map((r, i) => (
              <div
                key={i}
                className="p-4 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 flex justify-between"
              >
                <span className="font-medium dark:text-white">
                  {i + 1}. {r.name}
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {r.score} pts
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* QUESTION DETAILS */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold dark:text-white">
          Question Breakdown
        </h2>

        <div className="space-y-6 mt-4">
          {historyItem.questions.map((q, qi) => (
            <div
              key={qi}
              className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            >
              <h3 className="font-medium dark:text-white mb-2">
                Q{qi + 1}. {q.question}
              </h3>

              {historyItem.results.map((r, ri) => {
                const selected = r.answers?.[qi]?.selected;
                const correct = r.answers?.[qi]?.correct;
                const isCorrect = selected === correct;

                return (
                  <div key={ri} className="text-sm">
                    <span className="font-semibold">{r.name}:</span>{" "}
                    {selected == null ? (
                      <span className="italic text-gray-500">No answer</span>
                    ) : (
                      <span
                        className={
                          isCorrect
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {q.options[selected]}
                      </span>
                    )}
                    <span className="ml-2 text-gray-400 text-xs">
                      (correct: {q.options[correct]})
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
