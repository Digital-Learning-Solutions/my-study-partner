import React from "react";

export default function GroupHistoryDetails({ historyItem, goBack }) {
  if (!historyItem)
    return <p className="text-center text-red-400 mt-4">History not found</p>;

  const sortedResults = [...(historyItem.results || [])].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="space-y-8">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="
            px-4 py-1.5 text-sm rounded-xl 
            bg-white/5 border border-white/10 
            text-[#cbd5e1] hover:bg-white/10 
            transition
          "
        >
          ← Back
        </button>

        <div className="text-sm text-[#cbd5e1]">
          Played on:{" "}
          <span className="text-white font-medium">
            {new Date(historyItem.playedAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* RESULTS */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Results</h2>

        <div className="space-y-4">
          {sortedResults.map((r, index) => {
            const medal =
              index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";

            return (
              <div
                key={index}
                className="
                  p-4 rounded-2xl flex items-center justify-between
                  bg-white/6 border border-white/10 backdrop-blur-xl
                  shadow-[0_8px_35px_rgba(124,58,237,0.08)]
                "
              >
                {/* Left: medal + name */}
                <div className="flex items-center gap-4">
                  <div
                    className="
                      w-10 h-10 flex items-center justify-center rounded-full
                      bg-gradient-to-br from-indigo-500 to-purple-500
                      text-white text-lg shadow-[0_5px_20px_rgba(99,102,241,0.3)]
                    "
                  >
                    {medal || index + 1}
                  </div>

                  <span className="text-white font-medium">{r.name}</span>
                </div>

                {/* Score */}
                <div className="text-[#93c5fd] font-bold">{r.score} pts</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
