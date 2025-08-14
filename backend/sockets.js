
import { v4 as uuidv4 } from 'uuid';

// In-memory rooms for MVP
const rooms = new Map();

export default function(io){
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('create-room', ({ name }, cb) => {
      const code = Math.random().toString(36).slice(2,8).toUpperCase();
      const room = { code, hostId: socket.id, players: [{ id: socket.id, name, score: 0 }], questions: [], current: 0 };
      rooms.set(code, room);
      socket.join(code);
      cb?.({ success: true, code });
    });

    socket.on('join-room', ({ code, name }, cb) => {
      const room = rooms.get(code);
      if (!room) return cb?.({ success: false, message: 'Room not found' });
      room.players.push({ id: socket.id, name, score: 0 });
      socket.join(code);
      io.to(code).emit('room-update', { players: room.players.map(p=>({ name: p.name })) });
      cb?.({ success: true });
    });

    socket.on('start-game', ({ code, questions }, cb) => {
      const room = rooms.get(code);
      if (!room) return cb?.({ success: false, message: 'Room not found' });
      room.questions = questions;
      room.current = 0;
      io.to(code).emit('new-question', { question: questions[0], index: 0 });
      cb?.({ success: true });
    });

    socket.on('submit-answer', ({ code, selectedIndex }, cb) => {
      const room = rooms.get(code);
      if (!room) return cb?.({ success: false, message: 'Room not found' });
      const player = room.players.find(p => p.id === socket.id);
      if (!player) return cb?.({ success: false, message: 'Player not in room' });
      const currentQ = room.questions[room.current];
      const correct = currentQ.answer === selectedIndex;
      if (correct) player.score += 10;
      socket.emit('answer-result', { correct, correctIndex: currentQ.answer });
      io.to(code).emit('leaderboard', { players: room.players.map(p=>({ name: p.name, score: p.score })) });
      cb?.({ success: true });
    });

    socket.on('next-question', ({ code }, cb) => {
      const room = rooms.get(code);
      if (!room) return cb?.({ success: false });
      room.current += 1;
      if (room.current >= room.questions.length) {
        io.to(code).emit('game-over', { leaderboard: room.players.map(p=>({ name: p.name, score: p.score })) });
        rooms.delete(code);
        return cb?.({ finished: true });
      }
      io.to(code).emit('new-question', { question: room.questions[room.current], index: room.current });
      cb?.({ finished: false });
    });

    socket.on('disconnecting', () => {
      // remove player from any rooms
      for (const [code, room] of rooms.entries()){
        const idx = room.players.findIndex(p => p.id === socket.id);
        if (idx !== -1){
          room.players.splice(idx,1);
          io.to(code).emit('room-update', { players: room.players.map(p=>({ name: p.name })) });
        }
      }
    });
  });
}