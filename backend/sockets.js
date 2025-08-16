import { v4 as uuidv4 } from "uuid";

const rooms = new Map();

export default function (io) {
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

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
      if (player) {
        player.id = socket.id;
      } else {
        player = { id: socket.id, name, score: 0, answers: [] };
        room.players.push(player);
      }

      // 🔹 Make this socket the host if isHost flag is true and no host assigned
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

      if (socket.id !== room.hostId) {
        return cb?.({ success: false, message: "Only host can start game" });
      }

      room.questions = questions;
      room.current = 0;
      room.players.forEach((p) => {
        p.answers = [];
        p.score = 0;
      });
      room.finished = false;

      io.to(code).emit("new-question", {
        question: questions[0],
        index: 0,
      });
      cb?.({ success: true });
    });

    socket.on("submit-answer", ({ code, selectedIndex }, cb) => {
      const room = rooms.get(code);
      if (!room) return cb?.({ success: false, message: "Room not found" });

      const player = room.players.find((p) => p.id === socket.id);
      if (!player)
        return cb?.({ success: false, message: "Player not in room" });

      const currentQ = room.questions[room.current];
      const correct = currentQ.answer === selectedIndex;
      if (correct) player.score += 10;

      // Store in format frontend expects
      player.answers[room.current] = {
        selected: selectedIndex,
        correctIndex: currentQ.answer,
      };

      socket.emit("answer-result", {
        correct,
        correctIndex: currentQ.answer,
      });

      const leaderboard = Object.values(
        room.players.reduce((acc, p) => {
          acc[p.name] = { name: p.name, score: p.score };
          return acc;
        }, {})
      ).sort((a, b) => b.score - a.score);

      io.to(code).emit("leaderboard", { players: leaderboard });
      cb?.({ success: true });
    });

    socket.on("next-question", ({ code }, cb) => {
      const room = rooms.get(code);
      if (!room || room.finished) return cb?.({ success: false });

      room.current += 1;

      if (room.current >= room.questions.length) {
        room.finished = true;

        const finalLeaderboard = Object.values(
          room.players.reduce((acc, p) => {
            acc[p.name] = { name: p.name, score: p.score };
            return acc;
          }, {})
        ).sort((a, b) => b.score - a.score);

        // Send each player only their answers + allQuestions for review
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

    socket.on("disconnecting", () => {
      for (const [code, room] of rooms.entries()) {
        const idx = room.players.findIndex((p) => p.id === socket.id);
        if (idx !== -1) {
          io.to(code).emit("room-update", {
            players: room.players.map((p) => ({
              name: p.name,
              isHost: p.id === room.hostId,
            })),
          });
        }
      }
    });
  });
}
