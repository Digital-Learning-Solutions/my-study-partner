import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { useStoredContext } from "../../context/useStoredContext";

const SOCKET_URL = "http://localhost:5000";

export default function GamePage() {
  console.log("Rendering Game Page");
  const { code } = useParams(); // normal roomCode OR groupId
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

  const location = useLocation();
  const gameType = location.state?.gameType || "normal";
  const groupAdminId = location.state?.groupAdminId || null;
  const roomName = location.state?.roomName || null;
  const isHostRef = useRef(false);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username") || "Player";

  const { setSaaraPrompt, setSaaraOpen } = useStoredContext();
  // -------------------------------------------------------------
  // SOCKET INITIALIZATION (NORMAL + GROUP MODES)
  // -------------------------------------------------------------
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);

    // 🔵 NORMAL MODE: Join using method you already had
    if (gameType === "normal") {
      const name = sessionStorage.getItem("playerName") || "Guest";
      const hostFlag = sessionStorage.getItem("isHost") === "true";
      setIsHost(hostFlag);

      s.emit("join-room", { code, name, isHost: hostFlag });
    }

    // 🟣 GROUP MODE: Join using DB identity
    if (gameType === "group") {
      const amIHost = userId === groupAdminId;
      setIsHost(amIHost);
      isHostRef.current = amIHost;
      console.log("Am I Host:", amIHost);
      s.emit("join-group-room", {
        groupId: code,
        userId,
        username,
        isHost: amIHost,
      });
    }

    // -----------------------------------------------------------
    // LISTENERS
    // -----------------------------------------------------------
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
          console.log("Game type:", gameType, "Is Host:", isHostRef.current);
          // 🟣 SAVE GROUP RESULT
          console.log("leaderboard", leaderboard);
          if (gameType === "group" && isHostRef.current) {
            console.log("Emitting save-group-result", {
              groupId: code,
              leaderboard,
            });
            s.emit(
              "save-group-result",
              {
                groupId: code,
                leaderboard,
              },
              (response) => {
                console.log("Group result saved:", response);
              }
            );
          }
        }
      }
    );

    return () => {
      s.disconnect();

      // ❌ DO NOT CLEAR sessionStorage for group mode
      if (gameType === "normal") {
        sessionStorage.clear();
      }
    };
  }, []);

  // ----------------------------------------------------------------
  // TIMER (supports normal + group mode)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (question && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }

    if (question && timer === 0) {
      if (gameType === "group") {
        socket?.emit("next-group-question", { groupId: code });
      } else {
        socket?.emit("next-question", { code });
      }
    }
  }, [timer, question, socket, code, gameType]);

  // ----------------------------------------------------------------
  // NORMAL MODE → LOAD SAMPLE QUESTIONS
  // ----------------------------------------------------------------
  async function loadQuestionsForHost() {
    if (gameType === "group") return; // 🚫 disabled in group mode

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

  // ----------------------------------------------------------------
  // START GAME (DIFFERENT LOGIC FOR NORMAL & GROUP)
  // ----------------------------------------------------------------
  async function startGame() {
    if (!socket) return;

    // NORMAL MODE
    if (gameType === "normal") {
      if (questionsBank.length === 0) {
        alert("Load questions first");
        return;
      }

      socket.emit("start-game", { code, questions: questionsBank });
      return;
    }

    // GROUP MODE
    if (gameType === "group") {
      socket.emit("start-group-game", { groupId: code });
      try {
        await fetch(
          `http://localhost:5000/api/quiz-groups/${code}/end-active`,
          { method: "POST", headers: { "Content-Type": "application/json" } }
        );
        await fetch(
          `http://localhost:5000/api/quiz-groups/${code}/clear-lobby`,
          { method: "POST", headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error("Group backend sync error:", err);
      }
    }
  }

  // ----------------------------------------------------------------
  // SUBMIT ANSWER
  // ----------------------------------------------------------------
  function submitAnswer(i) {
    if (!socket || !question || selectedAnswer !== null) return;
    setSelectedAnswer(i);

    if (gameType === "normal") {
      socket.emit("submit-answer", { code, selectedIndex: i });
    }

    if (gameType === "group") {
      socket.emit("submit-group-answer", {
        groupId: code,
        userId,
        username,
        selectedIndex: i,
      });
    }
  }

  // ----------------------------------------------------------------
  // UI START
  // ----------------------------------------------------------------

  return (
    <div
      className="
      min-h-screen px-4 py-8 
      bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50
      dark:from-gray-900 dark:via-gray-950 dark:to-black
      transition-colors duration-300
    "
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {gameType == "normal" && (
          <h1 className="text-3xl md:text-4xl font-extrabold text-center">
            <span className="text-slate-800 dark:text-white">Room Code: </span>
            <span className="text-indigo-600 dark:text-indigo-400">{code}</span>
          </h1>
        )}
        {gameType == "group" && (
          <h1 className="text-3xl md:text-4xl font-extrabold text-center">
            <span className="text-slate-800 dark:text-white">Room Name: </span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {roomName}
            </span>
          </h1>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* PLAYERS + HOST PANEL */}
          <div
            className="
            p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
            border border-gray-200 dark:border-gray-700
          "
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Players
            </h3>

            <ul className="mt-3 space-y-1">
              {players.map((p, i) => (
                <li key={i} className="text-slate-700 dark:text-gray-300">
                  {p.name}{" "}
                  {p.isHost && (
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      (Host)
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* HOST CONTROLS */}
            {isHost && (
              <div className="mt-5 flex flex-col gap-3">
                <button
                  onClick={loadQuestionsForHost}
                  disabled={loadingQuestions}
                  className={`px-4 py-3 rounded-xl font-semibold shadow-md transition-all ${
                    loadingQuestions
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]"
                  }`}
                >
                  {loadingQuestions ? "Loading..." : "Load Questions"}
                </button>

                <button
                  onClick={startGame}
                  className="
                  px-4 py-3 bg-green-600 hover:bg-green-700 
                  text-white rounded-xl shadow-md transition-all hover:scale-[1.02]
                "
                >
                  Start Game
                </button>
              </div>
            )}
          </div>

          {/* LIVE QUESTION */}
          <div
            className="
            p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
            border border-gray-200 dark:border-gray-700 md:col-span-2
          "
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Live Question
            </h3>

            {question ? (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-500 dark:text-gray-400 mb-2">
                  <span>Question {index + 1}</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    ⏳ {timer}s
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {question.question}
                </h2>

                <div className="grid gap-3">
                  {question.options.map((o, i) => {
                    const isSelected = selectedAnswer === i;

                    return (
                      <button
                        key={i}
                        onClick={() => submitAnswer(i)}
                        disabled={selectedAnswer !== null}
                        className={`
                          p-3 text-left rounded-xl border shadow-sm transition-all
                          dark:text-white dark:border-gray-700
                          ${
                            isSelected
                              ? "bg-indigo-100 dark:bg-indigo-900/40"
                              : "hover:bg-indigo-50 dark:hover:bg-gray-700"
                          }
                          ${
                            selectedAnswer !== null && !isSelected
                              ? "opacity-80"
                              : ""
                          }
                        `}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-center text-slate-500 dark:text-gray-400">
                {isHost
                  ? "No live question. Start the game when ready."
                  : "Waiting for host to start the game..."}
              </p>
            )}
          </div>
        </div>

        {/* LEADERBOARD + REVIEW */}
        {leaderboard.length > 0 && !question && (
          <div
            className="
            p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg
            border border-gray-200 dark:border-gray-700 
            max-w-4xl mx-auto relative
          "
          >
            <span
              className="
              absolute top-3 right-3 px-3 py-1 text-xs font-bold
              bg-indigo-100 dark:bg-indigo-900
              text-indigo-700 dark:text-indigo-300 rounded-full
            "
            >
              Leaderboard
            </span>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 text-center">
              🏆 Top Players
            </h3>

            <ol className="space-y-2 w-2/3 mx-auto">
              {leaderboard.map((p, i) => (
                <li
                  key={i}
                  className={`
                    flex justify-between items-center px-3 py-2 rounded-lg border text-sm shadow-sm
                    ${
                      i === 0
                        ? "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 text-yellow-800 dark:text-yellow-300"
                        : i === 1
                        ? "bg-gray-200 dark:bg-gray-600 border-gray-400 text-gray-800 dark:text-gray-100"
                        : i === 2
                        ? "bg-orange-100 dark:bg-orange-900/40 border-orange-400 text-orange-800 dark:text-orange-300"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-slate-700 dark:text-gray-200"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {i === 0 && "🥇"}
                    {i === 1 && "🥈"}
                    {i === 2 && "🥉"}
                    {i + 1}. {p.name}
                  </span>

                  <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                    {p.score}
                  </span>
                </li>
              ))}
            </ol>

            {/* REVIEW */}
            {myAnswers.length > 0 && (
              <div className="mt-8">
                <h4 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
                  📋 Your Answer Review
                </h4>

                <div className="space-y-4">
                  {myAnswers.map((ans, qIndex) => {
                    const didNotAnswer = ans.selected === null;
                    const isCorrect =
                      !didNotAnswer && ans.selected === ans.answer;

                    return (
                      <div
                        key={qIndex}
                        className="
                          relative p-4 border rounded-xl bg-gray-50 dark:bg-gray-700
                          shadow-sm border-gray-200 dark:border-gray-600
                        "
                      >
                        <span
                          className={`
                            absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-bold
                            ${
                              didNotAnswer
                                ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                                : isCorrect
                                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                            }
                          `}
                        >
                          {didNotAnswer ? "⏺️" : isCorrect ? "✅" : "❌"}
                        </span>

                        <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                          Q{qIndex + 1}. {ans.question}
                        </h3>

                        <p className="mb-1">
                          <span className="font-medium">Your Answer:</span>{" "}
                          {didNotAnswer ? (
                            <span className="text-gray-500 italic">
                              You didn’t answer
                            </span>
                          ) : isCorrect ? (
                            <span className="text-green-700 dark:text-green-300 font-semibold">
                              {ans.options[ans.selected]}
                            </span>
                          ) : (
                            <span className="text-red-700 dark:text-red-300 font-semibold">
                              {ans.options[ans.selected]}
                            </span>
                          )}
                        </p>

                        <p>
                          <span className="font-medium">Correct Answer:</span>{" "}
                          <span className="text-green-700 dark:text-green-300 font-semibold">
                            {ans.options[ans.answer]}
                          </span>
                        </p>
                        <button
                          onClick={() => {
                            setSaaraPrompt(
                              `Explain this question:\n${ans.question}`
                            );
                            setSaaraOpen(true);
                          }}
                          className="
    mt-3 px-3 py-1.5 text-sm rounded-lg 
    bg-indigo-600 hover:bg-indigo-700 
    text-white shadow transition
  "
                        >
                          Ask Saara
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
