import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const rooms = new Map(); // NORMAL multiplayer rooms
const groupRooms = new Map(); // GROUP quiz active rooms

export default function (io) {
  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    // =============================================================
    //  NORMAL MODE — EXISTING FLOW
    // =============================================================
    socket.on("create-room", ({ name }, cb) => {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      const room = {
        code,
        hostId: socket.id,
        players: [{ id: socket.id, name, score: 0, answers: [] }],
        questions: [],
        current: 0,
        finished: false,
      };
      rooms.set(code, room);
      socket.join(code);
      cb?.({ success: true, code });
    });

    socket.on("join-room", ({ code, name, isHost }, cb) => {
      const room = rooms.get(code);
      if (!room) return cb?.({ success: false, message: "Room not found" });

      let player = room.players.find((p) => p.name === name);
      if (player) player.id = socket.id;
      else room.players.push({ id: socket.id, name, score: 0, answers: [] });

      if (
        isHost &&
        (!room.hostId || !room.players.some((p) => p.id === room.hostId))
      ) {
        room.hostId = socket.id;
      }

      socket.join(code);

      io.to(code).emit("room-update", {
        players: room.players.map((p) => ({
          name: p.name,
          isHost: p.id === room.hostId,
        })),
      });

      cb?.({ success: true });
    });

    socket.on("start-game", ({ code, questions }, cb) => {
      const room = rooms.get(code);
      if (!room) return cb?.({ success: false, message: "Room not found" });

      if (socket.id !== room.hostId)
        return cb?.({ success: false, message: "Only host can start" });

      room.questions = questions;
      room.current = 0;
      room.finished = false;
      room.players.forEach((p) => ((p.score = 0), (p.answers = [])));

      io.to(code).emit("new-question", {
        question: questions[0],
        index: 0,
      });
      cb?.({ success: true });
    });

    socket.on("submit-answer", ({ code, selectedIndex }, cb) => {
      const room = rooms.get(code);
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;

      const currentQ = room.questions[room.current];
      const isCorrect = currentQ.answer === selectedIndex;

      if (isCorrect) player.score += 10;
      player.answers[room.current] = {
        selected: selectedIndex,
        correctIndex: currentQ.answer,
      };

      socket.emit("answer-result", {
        correct: isCorrect,
        correctIndex: currentQ.answer,
      });

      console.log("Player scores updated:", room.players);

      const leaderboard = room.players
        .map((p) => ({ name: p.name, score: p.score }))
        .sort((a, b) => b.score - a.score);

      io.to(code).emit("leaderboard", { players: leaderboard });

      cb?.({ success: true });
    });

    socket.on("next-question", ({ code }, cb) => {
      const room = rooms.get(code);
      if (!room || room.finished) return;

      room.current++;

      if (room.current >= room.questions.length) {
        room.finished = true;

        const finalLeaderboard = room.players
          .map((p) => ({ name: p.name, score: p.score }))
          .sort((a, b) => b.score - a.score);
        console.log("Player scores updated:", finalLeaderboard);

        room.players.forEach((p) => {
          io.to(p.id).emit("game-over", {
            leaderboard: finalLeaderboard,
            answers: p.answers,
            allQuestions: room.questions,
          });
        });

        setTimeout(() => rooms.delete(code), 5000);
        return cb?.({ finished: true });
      }

      io.to(code).emit("new-question", {
        question: room.questions[room.current],
        index: room.current,
      });

      cb?.({ finished: false });
    });

    // =============================================================
    //  GROUP MODE — NEW FLOW
    // =============================================================
    socket.on(
      "join-group-room",
      ({ groupId, userId, username, isHost }, cb) => {
        try {
          const key = `group:${groupId}`;
          let g = groupRooms.get(key);

          if (!g) {
            g = {
              groupId,
              adminSocketId: null,
              players: [],
              questions: [],
              current: 0,
              finished: false,
            };
            groupRooms.set(key, g);
          }

          let player = g.players.find((p) => p.userId === userId);
          if (player) player.socketId = socket.id;
          else {
            g.players.push({
              socketId: socket.id,
              userId,
              username,
              score: 0,
              answers: [],
            });
          }

          if (isHost) g.adminSocketId = socket.id;

          socket.join(key);

          io.to(key).emit("room-update", {
            players: g.players.map((p) => ({
              name: p.username,
              isHost: p.socketId === g.adminSocketId,
              userId: p.userId,
            })),
          });

          cb?.({ success: true });
        } catch (err) {
          console.error("join-group-room error:", err);
          cb?.({ success: false });
        }
      }
    );

    socket.on("start-group-game", async ({ groupId }, cb) => {
      const key = `group:${groupId}`;
      const g = groupRooms.get(key);

      if (!g) return cb?.({ success: false, message: "Group lobby not found" });

      if (socket.id !== g.adminSocketId)
        return cb?.({ success: false, message: "Only admin can start" });

      try {
        let resp = await axios
          .get(`http://localhost:5000/api/quiz-groups/${groupId}/questions`)
          .catch(() => null);

        let questions = resp?.data?.questions || [];

        if (questions.length === 0) {
          const sample = await axios
            .get("http://localhost:5000/api/questions/sample")
            .catch(() => null);

          questions = sample?.data?.questions || [];
        }

        g.questions = questions;
        g.current = 0;
        g.finished = false;
        g.players.forEach((p) => ((p.score = 0), (p.answers = [])));

        if (questions.length > 0) {
          io.to(key).emit("new-question", {
            question: questions[0],
            index: 0,
          });
        } else {
          io.to(key).emit("game-over", {
            leaderboard: [],
            answers: [],
            allQuestions: [],
          });
        }

        cb?.({ success: true });
      } catch (err) {
        console.error("start-group-game error:", err);
        cb?.({ success: false });
      }
    });

    socket.on(
      "submit-group-answer",
      ({ groupId, userId, selectedIndex }, cb) => {
        const key = `group:${groupId}`;
        const g = groupRooms.get(key);
        if (!g) return;

        const player = g.players.find((p) => p.userId === userId);
        if (!player) return;

        const currentQ = g.questions[g.current];
        const correct = currentQ.answer === selectedIndex;

        if (correct) player.score += 10;

        player.answers[g.current] = {
          selected: selectedIndex,
          correctIndex: currentQ.answer,
        };

        socket.emit("answer-result", {
          correct,
          correctIndex: currentQ.answer,
        });

        const leaderboard = g.players
          .map((p) => ({ name: p.username, score: p.score }))
          .sort((a, b) => b.score - a.score);

        io.to(key).emit("leaderboard", { players: leaderboard });

        cb?.({ success: true });
      }
    );

    socket.on("next-group-question", ({ groupId }, cb) => {
      const key = `group:${groupId}`;
      const g = groupRooms.get(key);
      if (!g || g.finished) return;

      g.current++;

      if (g.current >= g.questions.length) {
        g.finished = true;

        const finalLeaderboard = g.players
          .map((p) => ({ name: p.username, score: p.score }))
          .sort((a, b) => b.score - a.score);

        g.players.forEach((p) => {
          io.to(p.socketId).emit("game-over", {
            leaderboard: finalLeaderboard,
            answers: p.answers,
            allQuestions: g.questions,
          });

          axios
            .post(
              `http://localhost:5000/api/quiz-groups/${g.groupId}/results`,
              {
                userId: p.userId,
                username: p.username,
                answers: p.answers,
                score: p.score,
              }
            )
            .catch(() => {});
        });

        setTimeout(() => groupRooms.delete(key), 5000);
        return cb?.({ finished: true });
      }

      io.to(key).emit("new-question", {
        question: g.questions[g.current],
        index: g.current,
      });

      cb?.({ finished: false });
    });

    // manual result save event
    socket.on("save-group-result", ({ groupId, leaderboard }, cb) => {
      console.log("save-group-result event received:", {
        groupId,
        leaderboard,
      });
      axios
        .post(`http://localhost:5000/api/quiz-groups/${groupId}/results`, {
          leaderboard,
        })
        .then(() => cb?.({ success: true }))
        .catch(() => cb?.({ success: false }));
    });

    // =============================================================
    // DISCONNECT
    // =============================================================
    socket.on("disconnecting", () => {
      // remove from normal rooms
      for (const [code, room] of rooms.entries()) {
        const idx = room.players.findIndex((p) => p.id === socket.id);
        if (idx !== -1) {
          room.players.splice(idx, 1);

          if (room.hostId === socket.id)
            room.hostId = room.players[0]?.id || null;

          io.to(code).emit("room-update", {
            players: room.players.map((p) => ({
              name: p.name,
              isHost: p.id === room.hostId,
            })),
          });
        }
      }

      // remove from group rooms
      for (const [key, g] of groupRooms.entries()) {
        const idx = g.players.findIndex((p) => p.socketId === socket.id);
        if (idx !== -1) {
          g.players.splice(idx, 1);

          if (g.adminSocketId === socket.id) g.adminSocketId = null;

          io.to(key).emit("room-update", {
            players: g.players.map((p) => ({
              name: p.username,
              isHost: p.socketId === g.adminSocketId,
              userId: p.userId,
            })),
          });
        }
      }
    });
  });
}
