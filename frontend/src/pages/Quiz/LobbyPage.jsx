import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// Components
import JoinedQuizGroups from "../../components/Quiz/JoinedQuizGroups";
import GroupSearchPage from "../../components/Quiz/GroupSearchPage";
import CreateQuizGroup from "../../components/Quiz/CreateQuizGroup";

const SOCKET_URL = "http://localhost:5000";

export default function LobbyPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Create socket only ONCE
  const [socket] = useState(() =>
    io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
    })
  );

  // ✅ Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [socket]);

  // === Create Room ===
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

  // === Join Room ===
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
        min-h-screen w-full
        bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50
        dark:from-gray-900 dark:via-gray-950 dark:to-black
        px-6 py-10 relative overflow-hidden
      "
    >
      {/* Dark glowing blobs */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none">
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-indigo-600 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500 opacity-10 blur-[110px] rounded-full"></div>
      </div>

      {/* === STACKED LAYOUT === */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        {/* CREATE QUIZ GROUP */}
        <CreateQuizGroup
          onCreated={(groupId) =>
            navigate(`/quiz/multiplayer/quiz-groups/${groupId}`)
          }
        />

        {/* JOINED GROUPS */}
        <JoinedQuizGroups />

        {/* SEARCH GROUPS */}
        <GroupSearchPage />

        {/* MULTIPLAYER LOBBY */}
        <div
          className="
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            rounded-2xl shadow-lg p-8 backdrop-blur-xl
          "
        >
          <h1 className="text-3xl font-extrabold text-center mb-6 dark:text-white">
            Multiplayer <span className="text-indigo-600">Lobby</span>
          </h1>

          {/* Mode Selection */}
          {!mode && (
            <div className="flex flex-col space-y-4 mt-4">
              <button
                onClick={() => setMode("create")}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow"
              >
                Create Room
              </button>

              <button
                onClick={() => setMode("join")}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow"
              >
                Join Room
              </button>
            </div>
          )}

          {/* Create Room Section */}
          {mode === "create" && (
            <div className="mt-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  border border-gray-300 dark:border-gray-600
                  p-3 w-full rounded-xl mb-3 dark:bg-gray-700 dark:text-white
                  focus:ring-2 focus:ring-indigo-400 outline-none
                "
                placeholder="Enter your name"
              />

              <button
                onClick={handleCreateRoom}
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                  loading
                    ? "bg-indigo-300"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Creating..." : "Create Room"}
              </button>

              <button
                onClick={() => setMode("")}
                className="mt-3 w-full text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Back
              </button>
            </div>
          )}

          {/* Join Room Section */}
          {mode === "join" && (
            <div className="mt-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  border border-gray-300 dark:border-gray-600
                  p-3 w-full rounded-xl mb-3 dark:bg-gray-700 dark:text-white
                  focus:ring-2 focus:ring-green-400 outline-none
                "
                placeholder="Enter your name"
              />

              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="
                  border border-gray-300 dark:border-gray-600
                  p-3 w-full rounded-xl mb-3 dark:bg-gray-700 dark:text-white
                  focus:ring-2 focus:ring-green-400 outline-none
                "
                placeholder="Enter room code"
              />

              <button
                onClick={handleJoinRoom}
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                  loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Joining..." : "Join Room"}
              </button>

              <button
                onClick={() => setMode("")}
                className="mt-3 w-full text-sm text-green-500 hover:underline dark:text-green-300"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
