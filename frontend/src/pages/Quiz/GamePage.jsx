import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:5000";

export default function GamePage() {
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

  // Initialize socket and listeners
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);

    const name = sessionStorage.getItem("playerName") || "Guest";
    const hostFlag = sessionStorage.getItem("isHost") === "true";
    setIsHost(hostFlag);

    s.emit("join-room", { code, name, isHost: hostFlag });

    s.off("room-update").on("room-update", ({ players }) => {
      setPlayers(players);
    });

    s.off("new-question").on("new-question", ({ question, index }) => {
      setQuestion(question);
      setIndex(index);
      setSelectedAnswer(null);
      setTimer(question?.time || 5);
    });

    s.off("leaderboard").on("leaderboard", ({ players }) => {
      const unique = [...new Map(players.map((p) => [p.name, p])).values()];
      setLeaderboard(unique.sort((a, b) => b.score - a.score));
    });

    s.off("game-over").on(
      "game-over",
      ({ leaderboard, answers, allQuestions }) => {
        const unique = [
          ...new Map(leaderboard.map((p) => [p.name, p])).values(),
        ];
        setLeaderboard(unique.sort((a, b) => b.score - a.score));
        setQuestion(null);
        setTimer(0);

        if (Array.isArray(allQuestions)) {
          const merged = allQuestions.map((q, i) => {
            const selected = answers?.[i]?.selected ?? null;
            return { ...q, selected };
          });
          setQuestionsBank(allQuestions);
          setMyAnswers(merged);
        } else {
          setQuestionsBank([]);
          setMyAnswers([]);
        }
      }
    );

    return () => {
      s.disconnect();
      sessionStorage.clear();
    };
  }, [code]);

  // Handle countdown timer
  useEffect(() => {
    if (question && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (question && timer <= 0) {
      socket?.emit("next-question", { code });
    }
  }, [timer, question, socket, code]);

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
    if (!socket || !question || selectedAnswer !== null) return;
    setSelectedAnswer(i);
    socket.emit("submit-answer", { code, selectedIndex: i });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Room Info */}
      <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 text-center">
        Room Code: {code}
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Player List & Host Controls */}
        <div className="p-5 bg-white rounded-xl shadow-md border">
          <h3 className="text-xl font-semibold text-gray-800">Players</h3>
          <ul className="mt-3 space-y-1">
            {players.map((p, i) => (
              <li key={i} className="text-gray-700">
                {p.name}{" "}
                {p.isHost && (
                  <span className="text-indigo-500 font-medium">(Host)</span>
                )}
              </li>
            ))}
          </ul>

          {isHost && (
            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={loadQuestionsForHost}
                disabled={loadingQuestions}
                className={`px-4 py-2 rounded-lg font-medium shadow transition ${
                  loadingQuestions
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {loadingQuestions ? "Loading..." : "Load Questions"}
              </button>
              <button
                onClick={startGame}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* Live Question Area */}
        <div className="p-5 bg-white rounded-xl shadow-md border md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800">Live Question</h3>
          {question ? (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Question {index + 1}</span>
                <span>⏳ {timer}s</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {question.question}
              </h2>
              <div className="grid gap-3">
                {question.options.map((o, i) => {
                  const isCorrect =
                    selectedAnswer !== null && i === question.correctIndex;
                  const isWrongChoice =
                    selectedAnswer === i && i !== question.correctIndex;

                  return (
                    <button
                      key={i}
                      onClick={() => submitAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={`p-3 text-left rounded-lg border shadow-sm transition
                        ${
                          selectedAnswer === i
                            ? "ring-2 ring-indigo-400"
                            : "hover:bg-indigo-50"
                        }
                        ${isCorrect ? "bg-green-100" : ""}
                        ${isWrongChoice ? "bg-red-100" : ""}
                      `}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-gray-500 text-center">
              {isHost
                ? "No live question. Start the game when ready."
                : "Waiting for host to start the game..."}
            </p>
          )}
        </div>
      </div>

      {/* Leaderboard & Review */}
      {leaderboard.length > 0 && !question && (
        <div className="p-6 bg-white rounded-xl shadow-md border max-w-4xl mx-auto relative">
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
            Leaderboard
          </span>
          <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
            🏆 Top Players
          </h3>
          <ol className="space-y-2 w-2/3 mx-auto">
            {leaderboard.map((p, i) => {
              let bg = "bg-gray-50";
              let text = "text-gray-700";
              let medal = null;

              if (i === 0) {
                bg = "bg-yellow-100 border-yellow-400";
                text = "text-yellow-800 font-semibold";
                medal = "🥇";
              } else if (i === 1) {
                bg = "bg-gray-200 border-gray-400";
                text = "text-gray-800 font-semibold";
                medal = "🥈";
              } else if (i === 2) {
                bg = "bg-orange-100 border-orange-400";
                text = "text-orange-800 font-semibold";
                medal = "🥉";
              }

              return (
                <li
                  key={i}
                  className={`flex justify-between items-center px-3 py-2 border rounded-lg text-sm shadow-sm ${bg}`}
                >
                  <span className={`${text} flex items-center gap-2`}>
                    {medal && <span>{medal}</span>}
                    {i + 1}. {p.name}
                  </span>
                  <span className="font-semibold text-indigo-700">
                    {p.score}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Answer Review Section */}
          {myAnswers.length > 0 && (
            <div className="mt-8">
              <h4 className="text-base font-semibold mb-4 text-gray-800">
                📋 Your Answer Review
              </h4>
              <div className="space-y-4">
                {myAnswers.map((ans, qIndex) => {
                  const didNotAnswer = ans.selected === null;
                  const isCorrect =
                    !didNotAnswer && ans.selected === ans.answer;

                  let badgeIcon = "⏺️";
                  let badgeColor = "bg-gray-200 text-gray-700";
                  if (!didNotAnswer && isCorrect) {
                    badgeIcon = "✅";
                    badgeColor = "bg-green-100 text-green-700";
                  } else if (!didNotAnswer && !isCorrect) {
                    badgeIcon = "❌";
                    badgeColor = "bg-red-100 text-red-700";
                  }

                  return (
                    <div
                      key={qIndex}
                      className="relative p-4 border rounded-lg bg-gray-50 shadow-sm"
                    >
                      <span
                        className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-bold ${badgeColor}`}
                      >
                        {badgeIcon}
                      </span>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Q{qIndex + 1}. {ans.question}
                      </h3>
                      <p className="mb-1">
                        <span className="font-medium text-gray-700">
                          Your Answer:
                        </span>{" "}
                        <span
                          className={
                            didNotAnswer
                              ? "text-gray-500 italic"
                              : isCorrect
                              ? "text-green-700 font-semibold"
                              : "text-red-700 font-semibold"
                          }
                        >
                          {didNotAnswer
                            ? "You didn’t answer"
                            : ans.options[ans.selected]}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Correct Answer:
                        </span>{" "}
                        <span className="text-green-700 font-semibold">
                          {ans.options[ans.answer]}
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
