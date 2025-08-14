const { v4: uuidv4 } = require('uuid');
const Room = require('./models/Room');

// In-memory room store as fallback if Mongo not connected
const inMemoryRooms = new Map();

function createRoomObject(code, hostId, hostName) {
  return {
    code,
    hostId,
    players: [{ socketId: hostId, name: hostName, score: 0 }],
    currentQuestionIndex: 0,
    questions: [],
    started: false
  };
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('create-room', async ({ name }, cb) => {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      const room = createRoomObject(code, socket.id, name || 'Host');
      inMemoryRooms.set(code, room);
      socket.join(code);
      cb({ success: true, code });
    });

    socket.on('join-room', ({ code, name }, cb) => {
      const room = inMemoryRooms.get(code);
      if (!room) return cb({ success: false, message: 'Room not found' });
      room.players.push({ socketId: socket.id, name, score: 0 });
      socket.join(code);
      io.to(code).emit('room-update', { players: room.players.map(p => ({ name: p.name })) });
      cb({ success: true });
    });

    socket.on('start-game', ({ code, questions }, cb) => {
      const room = inMemoryRooms.get(code);
      if (!room) return cb({ success: false, message: 'Room not found' });
      room.questions = questions; // server trusts host for starter version; validate later
      room.started = true;
      room.currentQuestionIndex = 0;
      // broadcast first question
      const q = room.questions[0];
      io.to(code).emit('new-question', { question: q, index: 0 });
      cb({ success: true });
    });

    socket.on('submit-answer', ({ code, questionId, selectedIndex }, cb) => {
      const room = inMemoryRooms.get(code);
      if (!room) return cb({ success: false, message: 'Room not found' });
      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return cb({ success: false, message: 'Player not found in room' });
      const question = room.questions[room.currentQuestionIndex];
      const correct = question.answer === selectedIndex;
      if (correct) player.score += 10; // simple scoring
      // notify player immediate feedback
      socket.emit('answer-result', { correct, correctIndex: question.answer });
      // update leaderboard to all
      io.to(code).emit('leaderboard', { players: room.players.map(p => ({ name: p.name, score: p.score })) });
      cb({ success: true });
    });

    socket.on('next-question', ({ code }, cb) => {
      const room = inMemoryRooms.get(code);
      if (!room) return cb({ success: false, message: 'Room not found' });
      room.currentQuestionIndex++;
      if (room.currentQuestionIndex >= room.questions.length) {
        io.to(code).emit('game-over', { leaderboard: room.players.map(p => ({ name: p.name, score: p.score })) });
        inMemoryRooms.delete(code); // cleanup
        return cb({ success: true, finished: true });
      }
      const q = room.questions[room.currentQuestionIndex];
      io.to(code).emit('new-question', { question: q, index: room.currentQuestionIndex });
      cb({ success: true, finished: false });
    });

    socket.on('disconnecting', () => {
      // remove player from any rooms
      const rooms = Array.from(inMemoryRooms.values());
      for (const room of rooms) {
        const idx = room.players.findIndex(p => p.socketId === socket.id);
        if (idx !== -1) {
          room.players.splice(idx, 1);
          io.to(room.code).emit('room-update', { players: room.players.map(p => ({ name: p.name })) });
        }
      }
    });
  });
};