import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:5000";

export default function Game() {
  const { code } = useParams();
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [index, setIndex] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [questionsBank, setQuestionsBank] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [myAnswers, setMyAnswers] = useState([]);
  const [timer, setTimer] = useState(5);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);

    const name = sessionStorage.getItem("playerName") || "Guest";
    const hostFlag = sessionStorage.getItem("isHost") === "true";
    setIsHost(hostFlag);

    // Pass isHost to server on join
    s.emit("join-room", { code, name, isHost: hostFlag });

    s.off("room-update").on("room-update", ({ players }) => {
      setPlayers(players);
    });

    s.off("new-question").on("new-question", ({ question, index }) => {
      setQuestion(question);
      setIndex(index);
      setSelectedAnswer(null);
      setTimer(question?.time || 10);
    });

    s.off("leaderboard").on("leaderboard", ({ players }) => {
      const unique = [...new Map(players.map((p) => [p.name, p])).values()];
      setLeaderboard(unique.sort((a, b) => b.score - a.score));
    });

    // Game over event now includes only *this player's* answers
    s.off("game-over").on("game-over", ({ leaderboard, answers, allQuestions }) => {
      const unique = [...new Map(leaderboard.map((p) => [p.name, p])).values()];
      setLeaderboard(unique.sort((a, b) => b.score - a.score));
      setQuestion(null);
      setTimer(0);

      if (Array.isArray(allQuestions)) {
        setQuestionsBank(allQuestions);
      }
      setMyAnswers(Array.isArray(answers) ? answers : []);
    });

    return () => s.disconnect();
  }, [code]);

  useEffect(() => {
    if (question && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (question && timer <= 0) {
      socket?.emit("next-question", { code });
    }
  }, [timer, question, socket, code]);

  // Auto-load questions if host joins
  useEffect(() => {
    if (isHost) {
      loadQuestionsForHost();
    }
  }, [isHost]);

  async function loadQuestionsForHost() {
    try {
      setLoadingQuestions(true);
      const res = await axios.get("http://localhost:5000/api/questions/sample");
      setQuestionsBank(res.data.questions);
    } catch (err) {
      console.error("Error loading questions", err);
    } finally {
      setLoadingQuestions(false);
    }
  }

  function startGame() {
    if (!socket) return;
    if (questionsBank.length === 0) {
      alert("Load questions first");
      return;
    }
    socket.emit("start-game", { code, questions: questionsBank });
  }

  function submitAnswer(i) {
    if (!socket || !question) return;
    if (selectedAnswer !== null) return;
    setSelectedAnswer(i);
    socket.emit("submit-answer", { code, selectedIndex: i });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Room: {code}</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Player List & Host Controls */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Players</h3>
          <ul className="mt-2">
            {players.map((p, i) => (
              <li key={i}>
                {p.name} {p.isHost && "(Host)"}
              </li>
            ))}
          </ul>

          {isHost && (
            <div className="mt-4 space-x-2">
              <button
                onClick={loadQuestionsForHost}
                disabled={loadingQuestions}
                className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                {loadingQuestions ? "Loading..." : "Load Questions"}
              </button>
              <button
                onClick={startGame}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* Live Question Area */}
        <div className="p-4 bg-white rounded shadow col-span-2">
          <h3 className="font-semibold">Live</h3>
          {question ? (
            <div>
              <div className="text-sm text-slate-500 flex justify-between mb-2">
                <span>Q {index + 1}</span>
                <span>⏳ {timer}s</span>
              </div>
              <h2 className="font-semibold">{question.question}</h2>
              <div className="mt-4 grid gap-2">
                {question.options.map((o, i) => {
                  const isCorrect = selectedAnswer !== null && i === question.correctIndex;
                  const isWrongChoice = selectedAnswer === i && i !== question.correctIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => submitAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={`text-left p-3 border rounded transition-colors duration-200
                        ${selectedAnswer === i ? "ring-2 ring-blue-400" : ""}
                        ${isCorrect ? "bg-green-200" : ""}
                        ${isWrongChoice ? "bg-red-200" : ""}
                      `}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              No live question.{" "}
              {isHost ? "Start the game when ready." : "Waiting for host..."}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard & My Answer Review */}
      {leaderboard.length > 0 && !question && (
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Leaderboard</h3>
          <ol className="mt-2">
            {leaderboard.map((p, i) => (
              <li key={i}>
                {p.name} — {p.score}
              </li>
            ))}
          </ol>

          {myAnswers.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">📋 Your Answer Review</h4>
              <div className="space-y-3">
                {myAnswers.map((ans, qIndex) => {
                  const isCorrect = ans.selected === ans.correctIndex;
                  return (
                    <div
                      key={qIndex}
                      className={`p-4 rounded-lg shadow-md border-l-8 ${
                        isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-700">Q{qIndex + 1}:</span>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            isCorrect
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {isCorrect ? "Correct ✅" : "Wrong ❌"}
                        </span>
                      </div>

                      <p className="mb-1">
                        <span className="font-medium text-gray-700">Your Answer: </span>
                        <span
                          className={`font-semibold ${
                            isCorrect ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {questionsBank[qIndex]?.options[ans.selected] || "No Answer"}
                        </span>
                      </p>

                      <p>
                        <span className="font-medium text-gray-700">Correct Answer: </span>
                        <span className="font-semibold text-green-700">
                          {questionsBank[qIndex]?.options[ans.correctIndex]}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
