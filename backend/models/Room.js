const mongoose = require('mongoose');
const RoomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  hostId: String,
  players: [{ socketId: String, name: String, score: { type: Number, default: 0 } }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.models.Room || mongoose.model('Room', RoomSchema);