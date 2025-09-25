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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 to-slate-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md sm:max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Multiplayer Lobby
        </h1>

        {!mode && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setMode("create")}
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg shadow hover:shadow-md hover:scale-105 transition-transform"
              aria-label="Create a new game room"
            >
              Create Room
            </button>
            <button
              onClick={() => setMode("join")}
              className="px-4 py-3 bg-green-600 text-white rounded-lg shadow hover:shadow-md hover:scale-105 transition-transform"
              aria-label="Join an existing game room"
            >
              Join Room
            </button>
          </div>
        )}

        {mode === "create" && (
          <div className="mt-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 mb-3"
              placeholder="Enter your name"
              aria-label="Enter your name"
            />
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className={`px-4 py-3 w-full rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Creating..." : "Create Room"}
            </button>
            <button
              onClick={() => setMode("")}
              className="mt-3 w-full text-sm text-indigo-500 hover:underline"
              aria-label="Go back"
            >
              Back
            </button>
          </div>
        )}

        {mode === "join" && (
          <div className="mt-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 mb-3"
              placeholder="Enter your name"
              aria-label="Enter your name"
            />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 mb-3"
              placeholder="Enter room code"
              aria-label="Enter room code"
            />
            <button
              onClick={handleJoinRoom}
              disabled={loading}
              className={`px-4 py-3 w-full rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
            <button
              onClick={() => setMode("")}
              className="mt-3 w-full text-sm text-green-500 hover:underline"
              aria-label="Go back"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
