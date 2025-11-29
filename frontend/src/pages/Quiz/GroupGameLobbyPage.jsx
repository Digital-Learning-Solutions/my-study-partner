/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoredContext } from "../../context/useStoredContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function GroupGameLobbyPage() {
  console.log("Rendering Group Game Lobby Page");
  const { groupId } = useParams();

  const navigate = useNavigate();
  const { user } = useStoredContext();

  const userId = localStorage.getItem("userId");
  const username = user?.username || "Unknown";

  const [members, setMembers] = useState([]);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [roomName, setRoomName] = useState("");

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingLobby, setLoadingLobby] = useState(true);

  // ✅ Load group members
  async function loadMembers() {
    try {
      setLoadingMembers(true);
      const res = await fetch(
        `${BACKEND_URL}/api/quiz-groups/${groupId}/history`
      );

      const data = await res.json();
      if (!data.group) return;

      setMembers(data.group.members || []);
      setIsAdmin(String(data.group.admin) === String(userId));
      setAdminId(data.group.admin);
      setRoomName(data.group.name || "");
    } catch (err) {
      console.error("Error loading members:", err);
    } finally {
      setLoadingMembers(false);
    }
  }

  // ✅ Load joined players
  async function loadJoinedPlayers() {
    try {
      setLoadingLobby(true);
      const res = await fetch(
        `${BACKEND_URL}/api/quiz-groups/${groupId}/lobby`
      );
      const data = await res.json();

      if (data.success) {
        setJoinedPlayers(data.joinedLobby || []);
      }
    } catch (err) {
      console.error("Error loading lobby players:", err);
    } finally {
      setLoadingLobby(false);
    }
  }

  // ✅ JOIN GAME
  const joinGame = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/quiz-groups/${groupId}/join-lobby`,
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
    // keep tiny timeout for UI snappiness
    setTimeout(() => {
      navigate(`/quiz/game/${groupId}`, {
        replace: true,
        state: { gameType: "group", groupAdminId: adminId, roomName },
      });
    }, 70);
  };

  // Auto-refresh
  useEffect(() => {
    loadMembers();
    loadJoinedPlayers();

    // const interval = setInterval(() => {
    //   loadMembers();
    //   loadJoinedPlayers();
    // }, 4000);

    // return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // small helper
  const amJoined = joinedPlayers.some(
    (p) => String(p.userId) === String(userId)
  );

  return (
    <div className="min-h-screen px-6 py-14 bg-[#050417] relative overflow-hidden">
      {/* background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-20 w-[520px] h-[520px] blur-[160px] opacity-30"
          style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
        />
        <div
          className="absolute bottom-0 right-10 w-[420px] h-[420px] blur-[140px] opacity-24"
          style={{ background: "linear-gradient(135deg,#ff7ab6,#7c3aed)" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          Group Game Lobby
        </h1>

        {/* Lobby Card */}
        <div className="rounded-3xl bg-white/6 backdrop-blur-xl border border-white/8 shadow-[0_30px_80px_rgba(99,102,241,0.06)] p-8 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Ready Players</h2>
              <p className="text-sm text-[#cbd5e1] mt-2">
                Players who clicked "Join" and are ready to play.
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-[#9ca3af]">Players</div>
              <div className="text-2xl font-extrabold text-[#93c5fd]">
                {joinedPlayers.length}
              </div>
              {isAdmin && (
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs shadow">
                  Admin
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {loadingLobby ? (
              <div className="animate-pulse space-y-3">
                <div className="h-12 rounded-xl bg-white/8"></div>
                <div className="h-12 rounded-xl bg-white/8"></div>
              </div>
            ) : joinedPlayers.length === 0 ? (
              <div className="text-sm text-[#cbd5e1]">
                No one has joined yet.
              </div>
            ) : (
              joinedPlayers.map((p) => (
                <div
                  key={p.userId}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/8"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{
                        background: "linear-gradient(135deg,#06b6d4,#7c3aed)",
                      }}
                    >
                      {String(p.username || p.userId)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{p.username}</div>
                      <div className="text-xs text-[#9ca3af]">Ready</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    {String(p.userId) === String(adminId) && (
                      <span className="px-2 py-1 rounded-full text-xs bg-white/8 text-[#cbd5e1] mr-2">
                        Host
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-full text-xs bg-indigo-700/20 text-[#c7d2fe]">
                      Joined
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Join Button */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            {!amJoined ? (
              <button
                onClick={joinGame}
                disabled={loadingLobby}
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg transform-gpu hover:scale-[1.02] transition"
              >
                {loadingLobby ? "Joining…" : "Join Game"}
              </button>
            ) : (
              <button
                onClick={() =>
                  navigate(`/quiz/game/${groupId}`, {
                    replace: true,
                    state: {
                      gameType: "group",
                      groupAdminId: adminId,
                      roomName,
                    },
                  })
                }
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-white/10 text-white/90 bg-white/6 font-semibold shadow-sm"
              >
                Enter Game (already joined)
              </button>
            )}
          </div>
        </div>

        {/* Members Card */}
        <div className="rounded-3xl bg-white/6 backdrop-blur-xl border border-white/8 shadow-[0_18px_50px_rgba(99,102,241,0.06)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Group Members</h2>
            <div className="text-sm text-[#9ca3af]">
              {members.length} members
            </div>
          </div>

          {loadingMembers ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 rounded-xl bg-white/8"></div>
              <div className="h-12 rounded-xl bg-white/8"></div>
              <div className="h-12 rounded-xl bg-white/8"></div>
            </div>
          ) : (
            <div className="grid gap-3">
              {members.map((m) => (
                <div
                  key={m.user}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/8"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{
                        background: "linear-gradient(135deg,#60a5fa,#a78bfa)",
                      }}
                    >
                      {m.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="text-white font-medium">{m.name}</div>
                      <div className="text-xs text-[#9ca3af]">
                        {m.email || ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {String(m.user) === String(adminId) && (
                      <span className="px-2 py-1 rounded-full text-xs bg-indigo-700/20 text-[#cbd5e1]">
                        Admin
                      </span>
                    )}
                    {String(m.user) === String(userId) && (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-700/20 text-[#bbf7d0]">
                        You
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-[#93c5fd] hover:underline"
            >
              ← Back to Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
