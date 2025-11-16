/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import GroupLeaderboard from "../../components/Quiz/GroupLeaderboardPage.jsx";
import GroupHistoryDetails from "../../components/Quiz/GroupHistoryDetailsPage.jsx";

const SOCKET_URL = "http://localhost:5000";

export default function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [socket, setSocket] = useState(null);

  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const [joinMessage, setJoinMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [section, setSection] = useState("overview");
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);

  // Load user
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid);
  }, []);

  // Socket setup
  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    if (userId) s.emit("register-user", userId);

    return () => s.disconnect();
  }, [userId]);

  // Load group ONLY WHEN userId exists
  useEffect(() => {
    if (userId) loadGroup();
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

      const me = localStorage.getItem("userId");

      setIsMember(g.members.some((m) => m.user === me || m.user?._id === me));
      setIsAdmin(g.admin === me);
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
      if (!res.ok) return alert(data.message);

      alert("Join request sent!");
    } catch (err) {
      alert("Error sending join request");
    }
  }

  // Admin → Start game
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
      if (!res.ok) return alert(data.message);

      // ❌ remove loadGroup() — causes stale reload
      // loadGroup();

      // ✔ go directly to lobby
      navigate(`/quiz/multiplayer/quiz-groups/live/${id}`);
    } catch (err) {
      console.error(err);
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
      if (!res.ok) return alert(data.message);

      loadGroup();
    } catch (err) {
      console.error(err);
    }
  }

  // ---------- UI START ----------
  if (loading) return <p className="text-center py-10">Loading group…</p>;
  if (!group)
    return <p className="text-center py-10 text-red-500">Group not found</p>;

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-black dark:to-gray-900">
      <div className="max-w-5xl mx-auto space-y-7">
        {/* HEADER */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold dark:text-white">
                {group.name}
              </h1>
              <p className="text-slate-500 dark:text-gray-400">
                {group.description}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Members</p>
              <p className="text-2xl text-indigo-600 dark:text-indigo-400">
                {group.members?.length}
              </p>
            </div>
          </div>

          {/* LIVE BANNER */}
          {group.isActiveGame && (
            <div
              className="mt-5 p-4 bg-green-600 text-white rounded-xl shadow-lg animate-pulse cursor-pointer"
              onClick={() =>
                navigate(`/quiz/multiplayer/quiz-groups/live/${id}`)
              }
            >
              ⚡ A Live Game is Active — Click to Join!
            </div>
          )}

          {/* JOIN GROUP */}
          {!isMember && (
            <div className="mt-4 space-y-3">
              <textarea
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:text-white"
                placeholder="Message to admin (optional)"
              />
              <button
                onClick={handleRequestJoin}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
              >
                Request To Join
              </button>
            </div>
          )}

          {/* TABS */}
          {isMember && (
            <div className="mt-6 flex gap-3">
              <button
                className={`tab-btn ${section === "overview" && "tab-active"}`}
                onClick={() => setSection("overview")}
              >
                Overview
              </button>

              <button
                className={`tab-btn ${
                  section === "leaderboard" && "tab-active"
                }`}
                onClick={() => setSection("leaderboard")}
              >
                Leaderboard
              </button>

              <button
                className={`tab-btn ${section === "history" && "tab-active"}`}
                onClick={() => {
                  setSelectedHistoryIndex(null);
                  setSection("history");
                }}
              >
                History
              </button>
            </div>
          )}
        </div>

        {/* ADMIN PANEL */}
        {isAdmin && section === "overview" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-indigo-600">
              Admin Panel
            </h3>

            <button
              onClick={handleStartGame}
              className="px-4 py-2 bg-green-600 text-white rounded-xl"
            >
              Start Game
            </button>

            <h4 className="text-lg font-semibold mt-5">Join Requests</h4>
            {!group.joinRequests?.length ? (
              <p className="text-slate-500">No pending requests</p>
            ) : (
              group.joinRequests.map((r) => (
                <div
                  key={r.user}
                  className="p-4 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl mt-2 flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-gray-500">{r.message}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(r.user, "approve")}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-xl"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleAction(r.user, "reject")}
                      className="px-3 py-1 border dark:border-gray-500 rounded-xl"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* OVERVIEW */}
        {section === "overview" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4">Members</h3>
              {group.members.map((m) => (
                <div
                  key={m.user}
                  className="p-3 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl mb-2"
                >
                  {m.name}
                  {m.user === group.admin && (
                    <span className="text-indigo-600 ml-2">(Admin)</span>
                  )}
                </div>
              ))}
            </div>

            {/* Recent History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4">Recent Games</h3>

              {!group.resultHistory?.length ? (
                <p className="text-slate-500">No games yet</p>
              ) : (
                group.resultHistory.slice(0, 5).map((h, index) => (
                  <div
                    key={index}
                    className="p-4 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3 cursor-pointer"
                    onClick={() => {
                      setSelectedHistoryIndex(index);
                      setSection("history");
                    }}
                  >
                    <p className="text-sm text-gray-500">
                      {new Date(h.playedAt).toLocaleString()}
                    </p>
                    <p className="font-semibold mt-1">
                      Winner:{" "}
                      <span className="text-indigo-600">
                        {h.results[0]?.name}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        {section === "leaderboard" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border dark:border-gray-700">
            <GroupLeaderboard group={group} />
          </div>
        )}

        {/* HISTORY */}
        {section === "history" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border dark:border-gray-700">
            {selectedHistoryIndex === null ? (
              <div className="space-y-4">
                {group.resultHistory.map((h, index) => (
                  <div
                    key={index}
                    className="p-4 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer"
                    onClick={() => setSelectedHistoryIndex(index)}
                  >
                    <p className="text-sm text-gray-500">
                      {new Date(h.playedAt).toLocaleString()}
                    </p>
                    <p className="font-semibold">
                      Winner:{" "}
                      <span className="text-indigo-600">
                        {h.results[0]?.name}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <GroupHistoryDetails
                historyItem={group.resultHistory[selectedHistoryIndex]}
                goBack={() => setSelectedHistoryIndex(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
