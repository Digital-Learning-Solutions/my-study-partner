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
      setTimer(question?.time || 5);
    });

    s.off("leaderboard").on("leaderboard", ({ players }) => {
      const unique = [...new Map(players.map((p) => [p.name, p])).values()];
      setLeaderboard(unique.sort((a, b) => b.score - a.score));
    });

    // Game over event now includes only *this player's* answers
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
          setQuestionsBank(allQuestions);

          // Merge answers with questions
          const merged = allQuestions.map((q, i) => {
            const selected = answers?.[i]?.selected ?? null;
            return {
              ...q,
              selected, // player's selected answer index
            };
          });
          setMyAnswers(merged);
        } else {
          setQuestionsBank([]);
          setMyAnswers([]);
        }
      }
    );

    return () => {
      s.disconnect();
      sessionStorage.removeItem("socketId");
      sessionStorage.removeItem("roomCode");
      sessionStorage.removeItem("playerName");
      sessionStorage.removeItem("isHost");
    };
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
  // useEffect(() => {
  //   if (isHost) {
  //     loadQuestionsForHost();
  //   }
  // }, [isHost]);

  async function loadQuestionsForHost() {
    try {
      setLoadingQuestions(true);
      const res = await axios.get(
        `{process.env.VITE_BACKEND_URL}/api/questions/sample`
      );
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
    <div className="space-y-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold">Room: {code}</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Player List & Host Controls */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
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
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow col-span-2">
          <h3 className="font-semibold">Live</h3>
          {question ? (
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-300 flex justify-between mb-2">
                <span>Q {index + 1}</span>
                <span>⏳ {timer}s</span>
              </div>
              <h2 className="font-semibold">{question.question}</h2>
              <div className="mt-4 grid gap-2">
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
                      className={`text-left p-3 border rounded transition-colors duration-200
                    dark:border-gray-600
                    ${selectedAnswer === i ? "ring-2 ring-blue-400" : ""}
                    ${isCorrect ? "bg-green-200 dark:bg-green-700" : ""}
                    ${isWrongChoice ? "bg-red-200 dark:bg-red-700" : ""}
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
        <div className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 w-4/6 mx-auto">
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100 rounded-full">
            Leaderboard
          </span>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
            🏆 Top Players
          </h3>
          <ol className="space-y-2 w-2/3 mx-auto">
            {leaderboard.map((p, i) => {
              let bg = "bg-gray-50"; // default
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
                  className={`flex justify-between items-center px-3 py-2 border rounded-lg text-sm ${bg}`}
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
            <div className="mt-28">
              <h4 className="text-base font-semibold mb-4 text-gray-800">
                📋 Your Answer Review
              </h4>
              <div className="space-y-4">
                {myAnswers.map((ans, qIndex) => {
                  const didNotAnswer = ans.selected === null;
                  const isCorrect =
                    !didNotAnswer && ans.selected === ans.answer;

                  // Decide corner badge content + color
                  let badgeIcon = "⏺️";
                  let badgeColor = "bg-gray-200 text-gray-700";
                  if (!didNotAnswer && isCorrect) {
                    badgeIcon = "✅";
                    badgeColor = "bg-green-100 text-green-700";
                  } else if (!didNotAnswer && !isCorrect) {
                    badgeIcon = "❌";
                    badgeColor = "bg-red-100 text-red-700";
                  } else {
                    badgeIcon = "⏺️";
                    badgeColor = "bg-gray-200 text-gray-700";
                  }

                  return (
                    <div
                      key={qIndex}
                      className="relative p-4 border rounded-lg bg-gray-50"
                    >
                      {/* Corner Badge for Each Answer */}
                      <span
                        className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-bold ${badgeColor}`}
                      >
                        {badgeIcon}
                      </span>

                      {/* Question */}
                      <h3 className="font-medium text-gray-900 mb-2">
                        Q{qIndex + 1}. {ans.question}
                      </h3>

                      {/* Your Answer */}
                      <p className="mb-1">
                        <span className="font-medium text-gray-700">
                          Your Answer:{" "}
                        </span>
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

                      {/* Correct Answer */}
                      <p>
                        <span className="font-medium text-gray-700">
                          Correct Answer:{" "}
                        </span>
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
