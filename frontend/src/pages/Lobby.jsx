import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function Lobby() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isCreateRoom, setCreateRoom] = useState(false);
  const [isJoinRoom, setJoinRoom] = useState(false);
  const navigate = useNavigate();

  function createRoom() {
    const socket = io(SOCKET_URL);
    socket.emit("create-room", { name }, ({ success, code }) => {
      if (success) {
        sessionStorage.setItem("socketId", socket.id);
        sessionStorage.setItem("roomCode", code);
        sessionStorage.setItem("playerName", name);
        sessionStorage.setItem("isHost", true);
        navigate(`/quiz/game/${code}`);
      } else alert("Create failed");
    });
  }

  function joinRoom() {
    const socket = io(SOCKET_URL);
    socket.emit("join-room", { code, name }, (res) => {
      if (res.success) {
        sessionStorage.setItem("socketId", socket.id);
        sessionStorage.setItem("roomCode", code);
        sessionStorage.setItem("playerName", name);
        navigate(`/quiz/game/${code}`);
      } else {
        alert(res.message || "Could not join room");
      }
    });
  }

  return (
    <div className="grid md:grid-cols-2 h-96 w-screen place-items-center dark:bg-gray-900 dark:text-gray-100">
      {/* Create Room */}
      <div
        className="p-6 bg-white dark:bg-gray-800 rounded shadow w-2/3"
        onMouseEnter={() => setCreateRoom(true)}
        onMouseLeave={() => setCreateRoom(false)}
      >
        <h2 className="text-xl font-semibold">Create Room</h2>
        {isCreateRoom && (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 mt-4 w-full rounded"
              placeholder="Your name"
            />
            <button
              onClick={createRoom}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
            >
              Create
            </button>
          </>
        )}
      </div>

      {/* Join Room */}
      <div
        className="p-6 bg-white dark:bg-gray-800 rounded shadow w-2/3"
        onMouseMoveCapture={() => setJoinRoom(true)}
        onMouseOutCapture={() => setJoinRoom(false)}
      >
        <h2 className="text-xl font-semibold">Join Room</h2>
        {isJoinRoom && (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 mt-4 w-full rounded"
              placeholder="Your name"
            />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 mt-4 w-full rounded"
              placeholder="Room code"
            />
            <button
              onClick={joinRoom}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Join
            </button>
          </>
        )}
      </div>
    </div>
  );
}
