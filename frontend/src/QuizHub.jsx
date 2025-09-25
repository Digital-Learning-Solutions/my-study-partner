import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Users } from "react-feather"; // npm install react-feather

export default function QuizHubPage() {
  const navigate = useNavigate();

  const cardBaseClasses =
    "cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 p-8 flex flex-col items-center text-center border border-gray-100";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4">
      {/* Page Heading */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 text-center leading-tight">
        Choose Your <span className="text-indigo-600">Quiz Mode</span>
      </h1>
      <p className="text-slate-600 text-base md:text-lg mb-10 text-center max-w-2xl">
        Practice solo with AI-generated quizzes or challenge your friends in a
        fun multiplayer mode!
      </p>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-4xl">
        {/* Solo Quiz Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/quiz/solo")}
          className={cardBaseClasses}
        >
          <div className="bg-indigo-100 text-indigo-600 rounded-full p-6 mb-4">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
            Solo Mode
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Test your knowledge with AI-generated quizzes based on your notes or topics.
          </p>
        </div>

        {/* Multiplayer Quiz Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/quiz/multiplayer")}
          className={cardBaseClasses}
        >
          <div className="bg-green-100 text-green-600 rounded-full p-6 mb-4">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
            Multiplayer Mode
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Create or join a room and compete with your friends in real-time.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-10 text-xs text-gray-400">
        🚀 Powered by <span className="font-semibold text-indigo-500">AI</span> for smarter learning
      </p>
    </div>
  );
}
