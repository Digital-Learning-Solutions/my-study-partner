import mongoose from "mongoose";

const leaderboardEntrySchema = new mongoose.Schema({
  name: { type: String },
  score: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const resultHistorySchema = new mongoose.Schema({
  playedAt: { type: Date, default: Date.now },
  results: [
    {
      name: { type: String },
      score: { type: Number },
    },
  ],
});

const joinRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  message: { type: String },
  requestedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const quizGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String },
        joinedAt: { type: Date, default: Date.now },
      },
    ],

    leaderboard: [leaderboardEntrySchema],
    resultHistory: [resultHistorySchema],
    joinRequests: [joinRequestSchema],

    // ⭐ ADD THIS — real multiplayer lobby
    joinedLobby: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String },
        joinedAt: { type: Date, default: Date.now },
      },
    ],

    settings: {
      defaultTimePerQuestion: { type: Number, default: 10 },
      maxPlayers: { type: Number, default: 50 },
    },

    isActiveGame: { type: Boolean, default: false },
    activeGameMeta: {
      startedAt: Date,
      startedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      questionsCount: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.QuizGroup ||
  mongoose.model("QuizGroup", quizGroupSchema);
