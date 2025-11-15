import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function LobbyPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const socket = io(SOCKET_URL, { autoConnect: false });

  const handleCreateRoom = () => {
    if (!name.trim()) return alert("Please enter your name.");
    setLoading(true);
    socket.connect();
    socket.emit("create-room", { name }, ({ success, code }) => {
      setLoading(false);
      if (success) {
        sessionStorage.setItem("socketId", socket.id);
        sessionStorage.setItem("roomCode", code);
        sessionStorage.setItem("playerName", name);
        sessionStorage.setItem("isHost", true);
        navigate(`/quiz/game/${code}`);
      } else {
        alert("Room creation failed. Try again.");
      }
    });
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !code.trim())
      return alert("Please enter your name and room code.");
    setLoading(true);
    socket.connect();
    socket.emit("join-room", { code, name }, (res) => {
      setLoading(false);
      if (res.success) {
        sessionStorage.setItem("socketId", socket.id);
        sessionStorage.setItem("roomCode", code);
        sessionStorage.setItem("playerName", name);
        navigate(`/quiz/game/${code}`);
      } else {
        alert(res.message || "Could not join room. Please check the code.");
      }
    });
  };

  return (
    <div
      className="
      flex flex-col items-center justify-center min-h-screen px-4
      bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50
      dark:from-gray-900 dark:via-gray-950 dark:to-black
      transition-colors duration-300 relative overflow-hidden
    "
    >
      {/* Dark glowing blobs */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none">
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-indigo-600 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500 opacity-10 blur-[110px] rounded-full"></div>
      </div>

      {/* Main Card */}
      <div
        className="
        relative z-10 bg-white dark:bg-gray-800
        rounded-2xl shadow-lg hover:shadow-xl
        border border-gray-100 dark:border-gray-700
        p-8 w-full max-w-md sm:max-w-lg
        backdrop-blur-xl transition-all animate-fade-in
      "
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
          <span className="text-slate-800 dark:text-white">Multiplayer </span>
          <span className="text-indigo-600 dark:text-indigo-400">Lobby</span>
        </h1>

        {/* Mode Selector */}
        {!mode && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setMode("create")}
              className="
                px-4 py-3 bg-indigo-600 hover:bg-indigo-700
                text-white rounded-xl shadow-md hover:shadow-xl
                transition-all hover:scale-[1.03] font-semibold
              "
            >
              Create Room
            </button>

            <button
              onClick={() => setMode("join")}
              className="
                px-4 py-3 bg-green-600 hover:bg-green-700
                text-white rounded-xl shadow-md hover:shadow-xl
                transition-all hover:scale-[1.03] font-semibold
              "
            >
              Join Room
            </button>
          </div>
        )}

        {/* Create Room */}
        {mode === "create" && (
          <div className="mt-4 animate-fade-in">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                border border-gray-300 dark:border-gray-600
                p-3 w-full rounded-xl mb-3
                dark:bg-gray-700 dark:text-white
                focus:ring-2 focus:ring-indigo-400 outline-none
              "
              placeholder="Enter your name"
            />

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className={`
                px-4 py-3 w-full rounded-xl text-white font-semibold
                transition-all
                ${
                  loading
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]"
                }
              `}
            >
              {loading ? "Creating..." : "Create Room"}
            </button>

            <button
              onClick={() => setMode("")}
              className="mt-3 w-full text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Back
            </button>
          </div>
        )}

        {/* Join Room */}
        {mode === "join" && (
          <div className="mt-4 animate-fade-in">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                border border-gray-300 dark:border-gray-600
                p-3 w-full rounded-xl mb-3
                dark:bg-gray-700 dark:text-white
                focus:ring-2 focus:ring-green-400 outline-none
              "
              placeholder="Enter your name"
            />

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="
                border border-gray-300 dark:border-gray-600
                p-3 w-full rounded-xl mb-3
                dark:bg-gray-700 dark:text-white
                focus:ring-2 focus:ring-green-400 outline-none
              "
              placeholder="Enter room code"
            />

            <button
              onClick={handleJoinRoom}
              disabled={loading}
              className={`
                px-4 py-3 w-full rounded-xl text-white font-semibold
                transition-all
                ${
                  loading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:scale-[1.02]"
                }
              `}
            >
              {loading ? "Joining..." : "Join Room"}
            </button>

            <button
              onClick={() => setMode("")}
              className="mt-3 w-full text-sm text-green-500 dark:text-green-300 hover:underline"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
