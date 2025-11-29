import React from "react";

export default function GroupLeaderboard({ leaderboard = [] }) {
  if (!leaderboard.length) {
    return (
      <p className="text-sm text-center text-[#9ca3af] py-4">
        No leaderboard yet
      </p>
    );
  }

  const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score || 0;

  return (
    <div className="space-y-4">
      {sorted.map((p, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
        const percent =
          topScore > 0 ? Math.round((p.score / topScore) * 100) : 0;

        return (
          <div
            key={i}
            className="
              relative overflow-hidden rounded-2xl p-5
              bg-white/5 backdrop-blur-xl
              border border-white/10
              shadow-[0_8px_35px_rgba(124,58,237,0.12)]
              hover:shadow-[0_12px_40px_rgba(124,58,237,0.18)]
              transition-all
            "
          >
            {/* Smooth neon progress fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-l-2xl"
              style={{
                width: `${percent}%`,
                background:
                  "linear-gradient(90deg, rgba(99,102,241,0.2), rgba(124,58,237,0.15))",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            />

            {/* CONTENT */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-10 h-10 flex items-center justify-center rounded-full
                    bg-gradient-to-br from-indigo-500 to-purple-500
                    text-white text-xl font-semibold shadow-[0_4px_15px_rgba(99,102,241,0.3)]
                  "
                >
                  {medal || i + 1}
                </div>

                <div>
                  <div className="font-semibold text-white text-sm sm:text-base">
                    {p.name}
                  </div>
                  <div className="text-xs text-[#cbd5e1]">Score: {p.score}</div>
                </div>
              </div>

              {/* Right side */}
              <div className="text-right">
                <div className="text-[#c7d2fe] font-bold text-base sm:text-lg">
                  {p.score} pts
                </div>
                <div className="text-xs text-[#9ca3af]">{percent}%</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
