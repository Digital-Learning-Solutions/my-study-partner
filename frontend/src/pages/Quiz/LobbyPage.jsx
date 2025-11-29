// src/pages/LobbyPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import JoinedQuizGroups from "../../components/Quiz/JoinedQuizGroups";
import GroupSearchPage from "../../components/Quiz/GroupSearchPage";
import CreateQuizGroup from "../../components/Quiz/CreateQuizGroup";

const SOCKET_URL = "http://localhost:5000";

export default function LobbyPage() {
  console.log("Rendering Lobby Page");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState("");
  const [activeTab, setActiveTab] = useState("groups"); // NEW
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // SOCKET CONNECTION
  const [socket] = useState(() =>
    io(SOCKET_URL, { autoConnect: false, transports: ["websocket"] })
  );

  useEffect(() => {
    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [socket]);

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
      } else alert("Room creation failed. Try again.");
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
      } else alert(res.message || "Invalid room code.");
    });
  };

  return (
    <div className="min-h-screen w-full px-6 py-14 bg-[#060417] relative overflow-hidden">
      {/* BACKGROUND FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -left-16 w-96 h-96 blur-[140px] opacity-40"
          style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
        />
        <div
          className="absolute bottom-0 right-16 w-[450px] h-[450px] blur-[160px] opacity-30"
          style={{ background: "linear-gradient(135deg,#ff4096,#7c3aed)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* 🔙 Beautiful Glass Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="
    absolute left-0 -top-4
    px-4 py-2 rounded-xl flex items-center gap-2
    text-white font-extralight text-sm

    bg-white/10 backdrop-blur-md border border-white/10
    hover:bg-white/20


    transition duration-200
    bg-gradient-to-r from-[#7c3aed]/20 via-[#9333ea]/20 to-[#3b82f6]/20
  "
        >
          ← Back
        </button>

        {/* HEADER */}
        <h1 className="text-center text-4xl font-extrabold text-white mb-10">
          Quiz{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#7c3aed]">
            Hub
          </span>
        </h1>

        {/* --------------------------- */}
        {/*       SWITCH TABS UI       */}
        {/* --------------------------- */}
        <div className="flex justify-center mb-10 gap-4">
          <button
            onClick={() => setActiveTab("groups")}
            className={`
        px-6 py-3 rounded-2xl font-semibold transition
        ${
          activeTab === "groups"
            ? "bg-[linear-gradient(90deg,#06b6d4,#7c3aed)] text-white shadow-[0_10px_30px_rgba(6,182,212,0.30)]"
            : "bg-white/5 text-[#a5b4fc] hover:bg-white/10 border border-white/10"
        }
      `}
          >
            Quiz Groups
          </button>

          <button
            onClick={() => setActiveTab("quick")}
            className={`
        px-6 py-3 rounded-2xl font-semibold transition
        ${
          activeTab === "quick"
            ? "bg-[linear-gradient(90deg,#ef4444,#f97316)] text-white shadow-[0_10px_30px_rgba(239,68,68,0.30)]"
            : "bg-white/5 text-[#fca5a5] hover:bg-white/10 border border-white/10"
        }
      `}
          >
            Quick Match
          </button>
        </div>

        {/* --------------------------- */}
        {/*        TAB : GROUPS        */}
        {/* --------------------------- */}
        {activeTab === "groups" && (
          <div
            className="
              p-8 rounded-3xl border border-[rgba(255,255,255,0.06)]
              shadow-[0_25px_70px_rgba(124,58,237,0.10)]
              backdrop-blur-2xl 
              bg-[linear-gradient(135deg,rgba(124,58,237,0.10),rgba(6,182,212,0.08))]
            "
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Manage Your Quiz Groups
            </h2>

            {/* Create + Search side-by-side */}
            <div className="grid lg:grid-cols-2 gap-10 mb-12">
              <CreateQuizGroup
                onCreated={(groupId) =>
                  navigate(`/quiz/multiplayer/quiz-groups/${groupId}`)
                }
              />

              <div
                className="
                  p-6 rounded-2xl border border-[rgba(255,255,255,0.04)]
                  bg-[rgba(255,255,255,0.03)]
                  shadow-[0_10px_40px_rgba(124,58,237,0.12)]
                  backdrop-blur-xl
                "
              >
                <GroupSearchPage />
              </div>
            </div>

            {/* FULL WIDTH Joined Groups */}
            <div
              className="
                p-6 rounded-2xl border border-[rgba(255,255,255,0.05)]
                bg-[linear-gradient(135deg,rgba(99,102,241,0.10),rgba(124,58,237,0.05))]
                shadow-[0_10px_40px_rgba(99,102,241,0.10)]
              "
            >
              <JoinedQuizGroups />
            </div>
          </div>
        )}

        {/* --------------------------- */}
        {/*       TAB : QUICK MATCH     */}
        {/* --------------------------- */}
        {activeTab === "quick" && (
          <div
            className="
              p-10 rounded-3xl 
              bg-gradient-to-br from-[#ef4444]/25 to-[#f59e0b]/20
              border border-[rgba(255,255,255,0.04)]
              shadow-[0_25px_80px_rgba(239,68,68,0.12)]
              backdrop-blur-2xl
            "
          >
            <h2 className="text-3xl font-bold text-white mb-2">Quick Match</h2>
            <p className="text-[#fde68a] mb-6">
              Temporary one-time multiplayer game.
            </p>

            {!mode && (
              <div className="grid md:grid-cols-2 gap-5 mt-4">
                <button
                  onClick={() => setMode("create")}
                  className="
                    w-full py-4 rounded-2xl font-bold text-white
                    bg-[linear-gradient(90deg,#06b6d4,#7c3aed)]
                    hover:scale-105 transition transform-gpu
                  "
                >
                  Create Quick Room
                </button>

                <button
                  onClick={() => setMode("join")}
                  className="
                    w-full py-4 rounded-2xl font-bold text-white
                    bg-[linear-gradient(90deg,#ef4444,#f97316)]
                    hover:scale-105 transition transform-gpu
                  "
                >
                  Join With Code
                </button>
              </div>
            )}

            {/* CREATE ROOM */}
            {mode === "create" && (
              <div className="mt-6 space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="
                    w-full p-4 rounded-xl bg-white/5
                    border border-white/10 text-white
                    focus:ring-2 focus:ring-[#7c3aed]
                  "
                />
                <button
                  onClick={handleCreateRoom}
                  className="
                    w-full py-4 rounded-2xl font-bold text-white
                    bg-[linear-gradient(90deg,#06b6d4,#7c3aed)]
                    hover:scale-105 transition
                  "
                >
                  {loading ? "Creating..." : "Create Room"}
                </button>
                <button
                  onClick={() => setMode("")}
                  className="text-sm text-[#fecaca] hover:underline"
                >
                  Back
                </button>
              </div>
            )}

            {/* JOIN ROOM */}
            {mode === "join" && (
              <div className="mt-6 space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="
                    w-full p-4 rounded-xl bg-white/5
                    border border-white/10 text-white
                    focus:ring-2 focus:ring-orange-400
                  "
                />

                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter room code"
                  className="
                    w-full p-4 rounded-xl bg-white/5
                    border border-white/10 text-white
                    focus:ring-2 focus:ring-orange-400
                  "
                />

                <button
                  onClick={handleJoinRoom}
                  className="
                    w-full py-4 rounded-2xl font-bold text-white
                    bg-[linear-gradient(90deg,#ef4444,#f97316)]
                    hover:scale-105 transition
                  "
                >
                  {loading ? "Joining..." : "Join Room"}
                </button>

                <button
                  onClick={() => setMode("")}
                  className="text-sm text-[#fecaca] hover:underline"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
