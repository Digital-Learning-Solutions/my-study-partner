// routes/quizGroupRoutes.js
import express from "express";
import {
  createGroup,
  searchGroups,
  requestJoin,
  handleJoinRequest,
  listUserGroups,
  startGame,
  submitGameResult,
  getGroupHistory,
  endActiveGame,
  joinLobby,
  leaveLobby,
  getLobbyPlayers,
  clearLobby,
  getGroupQuestions,
  saveGroupGameResult,
} from "../../controllers/quiz/quizGroupController.js";

const quizGroupRouter = express.Router();

// public search groups
quizGroupRouter.get("/", searchGroups);

// create group
quizGroupRouter.post("/", createGroup);

// request join
quizGroupRouter.post("/:id/request", requestJoin);

// approve/reject user
quizGroupRouter.post("/:id/requests/:userId", handleJoinRequest);

// list groups the logged-in user belongs to
quizGroupRouter.get("/mine", listUserGroups);

// start game
quizGroupRouter.post("/:id/start", startGame);

// submit results
quizGroupRouter.post("/:id/submit-result", submitGameResult);

// get history + leaderboard
quizGroupRouter.get("/:id/history", getGroupHistory);
quizGroupRouter.post("/:id/end-active", endActiveGame);
quizGroupRouter.post("/:id/join-lobby", joinLobby);
quizGroupRouter.post("/:id/leave-lobby", leaveLobby);
quizGroupRouter.get("/:id/lobby", getLobbyPlayers);
quizGroupRouter.post("/:id/clear-lobby", clearLobby);

// fetch questions for group game
quizGroupRouter.get("/:id/questions", getGroupQuestions);

// socket-driven results save
quizGroupRouter.post("/:id/results", saveGroupGameResult);

export default quizGroupRouter;
