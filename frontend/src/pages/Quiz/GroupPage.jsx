/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import GroupLeaderboard from "../../components/Quiz/GroupLeaderboard.jsx";
import GroupHistoryDetails from "../../components/Quiz/GroupHistoryDetails.jsx";

const SOCKET_URL = "http://localhost:5000";

export default function GroupPage() {
  console.log("Rendering Group Page");
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [socket, setSocket] = useState(null);

  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const [joinMessage, setJoinMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);

  // Load logged userId
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  // Initialize Socket
  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    if (userId) s.emit("register-user", userId);

    return () => s.disconnect();
  }, [userId]);

  // Load group when userId exists
  useEffect(() => {
    if (userId) loadGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  // Load group details
  async function loadGroup() {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/quiz-groups/${id}/history?userId=${userId}`
      );

      if (!res.ok) return;

      const data = await res.json();
      const g = data.group;

      setGroup(g);

      // Check membership/admin safely
      const me = userId;
      setIsMember(
        Array.isArray(g.members) &&
          g.members.some((m) => String(m.user) === String(me))
      );
      setIsAdmin(String(g.admin) === String(me));
    } catch (err) {
      console.error("Error loading group:", err);
    } finally {
      setLoading(false);
    }
  }

  // Send join request
  async function handleRequestJoin() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/quiz-groups/${id}/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, message: joinMessage }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to send request");

      alert("Join request sent!");
      setJoinMessage("");
      loadGroup();
    } catch (err) {
      console.error(err);
      alert("Error sending join request");
    }
  }

  // Start a game
  async function handleStartGame() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/quiz-groups/${id}/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, questionsCount: 10 }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to start game");

      // navigate to live page
      navigate(`/quiz/multiplayer/quiz-groups/live/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error starting game");
    }
  }

  // Approve / Reject join request
  async function handleAction(targetUserId, action) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/quiz-groups/${id}/requests/${targetUserId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, action }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Action failed");

      loadGroup();
    } catch (err) {
      console.error(err);
      alert("Error processing request");
    }
  }

  // UI states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060417]">
        <div className="text-white/80 text-lg">Loading group…</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060417]">
        <div className="text-red-400 text-lg font-semibold">
          Group not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[#060417] relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-28 -left-16 w-96 h-96 blur-[140px] opacity-30"
          style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
        />
        <div
          className="absolute -bottom-20 right-6 w-80 h-80 blur-[120px] opacity-24"
          style={{ background: "linear-gradient(135deg,#604584,#a78bda)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* HEADER (group name left) + compact stats right */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/6 backdrop-blur-lg border border-white/8 shadow-[0_18px_50px_rgba(99,102,241,0.06)]">
            <h1 className="text-3xl font-extrabold text-white">{group.name}</h1>
            <p className="mt-2 text-sm text-[#cbd5e1] max-w-3xl">
              {group.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full bg-white/8 text-[#c7d2fe]">
                ID: {String(group._id).slice(0, 6)}
              </span>

              {group.isActiveGame && isMember && (
                <button
                  onClick={() =>
                    navigate(`/quiz/multiplayer/quiz-groups/live/${id}`)
                  }
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-green-600 text-white text-sm shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                >
                  ⚡ Live Game — Join
                </button>
              )}

              {!isMember && (
                <span className="ml-2 text-sm text-[#9ca3af]">
                  You are not a member — send a request below
                </span>
              )}
            </div>
          </div>

          {/* Compact leaderboard / stats on the right */}
          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-lg border border-white/8 shadow-[0_12px_40px_rgba(99,102,241,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-[#9ca3af]">Members</p>
                <p className="text-2xl font-extrabold text-[#93c5fd]">
                  {group.members?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9ca3af]">Games</p>
                <p className="text-2xl font-extrabold text-[#fca5a5]">
                  {group.resultHistory?.length || 0}
                </p>
              </div>
            </div>

            <h4 className="text-sm text-white font-semibold mb-3">
              Top Players
            </h4>
            {!group.leaderboard?.length ? (
              <p className="text-sm text-[#9ca3af]">No leaderboards yet</p>
            ) : (
              <div className="space-y-2">
                {group.leaderboard
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {i + 1}
                        </div>
                        <div className="text-sm text-white">{p.name}</div>
                      </div>
                      <div className="text-sm text-[#93c5fd] font-bold">
                        {p.score}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* ADMIN PANEL (FULL WIDTH under header) */}
        {isAdmin && (
          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-lg border border-white/8 shadow-[0_18px_60px_rgba(124,58,237,0.06)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Admin Panel</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartGame}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-green-600 text-white font-semibold shadow-[0_10px_30px_rgba(16,185,129,0.12)]"
                >
                  Start Game
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-[#cbd5e1] mb-3">
                Pending Join Requests
              </h4>

              {!group.joinRequests?.length ? (
                <div className="text-sm text-[#9ca3af]">
                  No pending requests
                </div>
              ) : (
                <div className="grid gap-3">
                  {group.joinRequests
                    .filter((r) => r.status === "pending")
                    .map((r) => (
                      <div
                        key={r.user}
                        className="p-3 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-white">{r.name}</div>
                          <div className="text-xs text-[#9ca3af]">
                            {r.message}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(r.user, "approve")}
                            className="px-3 py-1 rounded-lg bg-indigo-600 text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(r.user, "reject")}
                            className="px-3 py-1 rounded-lg border border-white/8 text-[#cbd5e1]"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* JOIN REQUEST (for visitors) */}
        {!isMember && (
          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-lg border border-white/8">
            <h3 className="text-lg font-semibold text-white mb-3">
              Request to Join
            </h3>
            <textarea
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              placeholder="Message to admin (optional)"
              className="w-full p-3 rounded-xl bg-white/8 text-white placeholder:text-[#9ca3af] border border-white/10"
            />
            <div className="mt-3 flex gap-3">
              <button
                onClick={handleRequestJoin}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
              >
                Request To Join
              </button>
              <button
                onClick={() => {
                  setJoinMessage("");
                }}
                className="px-4 py-2 rounded-xl border border-white/10 text-[#cbd5e1]"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* MEMBERS + RECENT GAMES */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Members */}
          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-lg border border-white/8">
            <h3 className="text-xl font-semibold text-white mb-4">Members</h3>
            <div className="space-y-3 max-h-[360px] overflow-auto pr-2">
              {group.members.map((m, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {m.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="font-medium text-white">{m.name}</div>
                      <div className="text-xs text-[#9ca3af]">
                        {m.email || ""}
                      </div>
                    </div>
                  </div>

                  {String(m.user) === String(group.admin) && (
                    <div className="text-xs font-semibold text-[#c7d2fe]">
                      Admin
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Games */}
          <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-lg border border-white/8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Games
            </h3>

            {!group.resultHistory?.length ? (
              <p className="text-sm text-[#9ca3af]">No games yet</p>
            ) : (
              <div
                className="space-y-3 max-h-[360px] overflow-auto pr-2 [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-white/5
    [&::-webkit-scrollbar-track]:rounded-full

    [&::-webkit-scrollbar-thumb]:bg-[rgba(124,58,237,0.55)]
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb:hover]:bg-[rgba(124,58,237,0.75)]

    dark:[&::-webkit-scrollbar-track]:bg-white/10
    dark:[&::-webkit-scrollbar-thumb]:bg-[rgba(167,139,250,0.55)]
    dark:[&::-webkit-scrollbar-thumb:hover]:bg-[rgba(167,139,250,0.75)]"
              >
                {group.resultHistory.slice(0, 5).map((h, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedHistoryIndex(index)}
                    className="p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition"
                  >
                    <div className="text-sm text-[#cbd5e1]">
                      {new Date(h.playedAt).toLocaleString()}
                    </div>
                    <div className="font-medium text-white mt-1">
                      Winner:{" "}
                      <span className="text-[#93c5fd]">
                        {h.results[0]?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FULL HISTORY + DETAILS */}
        <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-lg border border-white/8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Full History
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* list */}
            <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
              {group.resultHistory?.length ? (
                group.resultHistory.map((h, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedHistoryIndex(idx)}
                    className={`p-3 rounded-xl cursor-pointer transition ${
                      selectedHistoryIndex === idx
                        ? "bg-white/10 border-purple-400/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <div className="text-sm text-[#cbd5e1]">
                      {new Date(h.playedAt).toLocaleString()}
                    </div>
                    <div className="font-medium text-white mt-1">
                      Winner:{" "}
                      <span className="text-[#93c5fd]">
                        {h.results[0]?.name}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#9ca3af]">No history available</p>
              )}
            </div>

            {/* details */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 min-h-[220px]">
              {selectedHistoryIndex === null ? (
                <div className="text-center text-[#9ca3af] mt-12">
                  Select a history item to view details
                </div>
              ) : (
                <GroupHistoryDetails
                  historyItem={group.resultHistory[selectedHistoryIndex]}
                  goBack={() => setSelectedHistoryIndex(null)}
                />
              )}
            </div>
          </div>
        </div>

        {/* FULL LEADERBOARD */}
        <div className="p-6 rounded-2xl bg-white/6 backdrop-blur-lg border border-white/8">
          <h3 className="text-xl font-semibold text-white mb-4">Leaderboard</h3>
          <GroupLeaderboard leaderboard={group.leaderboard || []} />
        </div>
      </div>
    </div>
  );
}
