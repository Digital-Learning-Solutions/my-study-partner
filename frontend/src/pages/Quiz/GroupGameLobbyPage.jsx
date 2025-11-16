/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoredContext } from "../../context/useStoredContext";

export default function GroupGameLobbyPage() {
  const { groupId } = useParams();

  const navigate = useNavigate();
  const { user } = useStoredContext();

  const userId = localStorage.getItem("userId");
  const username = user?.username || "Unknown";

  const [members, setMembers] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState("");

  // ✅ Load group members
  async function loadMembers() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/quiz-groups/${groupId}/history`
      );

      const data = await res.json();
      if (!data.group) return;

      setMembers(data.group.members || []);
      setIsAdmin(data.group.admin === userId);
      setAdminId(data.group.admin);
    } catch (err) {
      console.error("Error loading members:", err);
    }
  }

  // ✅ Load joined players
  async function loadJoinedPlayers() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/quiz-groups/${groupId}/lobby`
      );
      const data = await res.json();

      if (data.success) {
        setJoinedPlayers(data.joinedLobby || []);
      }
    } catch (err) {
      console.error("Error loading lobby players:", err);
    }
  }

  // ✅ JOIN GAME
  const joinGame = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/quiz-groups/${groupId}/join-lobby`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, username }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setJoinedPlayers(data.joinedLobby);
      }
    } catch (err) {
      console.error("Error joining lobby:", err);
    }

    // ⭐ NEW: Store username for GamePage socket
    localStorage.setItem("username", username);

    // Redirect to game page
    setTimeout(() => {
      navigate(`/quiz/game/${groupId}`, {
        state: { gameType: "group", groupAdminId: adminId },
      });
    }, 50);
  };

  // Auto-refresh
  useEffect(() => {
    loadMembers();
    loadJoinedPlayers();

    const interval = setInterval(() => {
      loadMembers();
      loadJoinedPlayers();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen px-4 py-14 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-all relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10">
          Group Game Lobby
        </h1>

        {/* Lobby Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ready Players
          </h2>

          {joinedPlayers.length === 0 && (
            <p className="text-slate-500 text-sm dark:text-gray-400 mb-4">
              No one has joined yet.
            </p>
          )}

          <div className="space-y-3">
            {joinedPlayers.map((p) => (
              <div
                key={p.userId}
                className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm flex justify-between items-center"
              >
                <span className="font-medium">{p.username}</span>
                <span className="text-xs bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
                  Joined
                </span>
              </div>
            ))}
          </div>

          {/* Join Button */}
          {!joinedPlayers.some((p) => p.userId === userId) && (
            <button
              onClick={joinGame}
              className="mt-6 w-full px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md hover:scale-[1.02]"
            >
              Join Game
            </button>
          )}
        </div>

        {/* Members */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Group Members
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {members.map((m) => (
              <div
                key={m.user}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-sm flex justify-between items-center"
              >
                <span className="font-medium">{m.name}</span>

                {m.user === userId && (
                  <span className="text-xs px-2 py-1 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300">
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-10 mx-auto block text-center text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Group
        </button>
      </div>
    </div>
  );
}
