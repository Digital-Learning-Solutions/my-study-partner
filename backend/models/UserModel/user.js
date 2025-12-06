// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Enrolled quiz groups - added
    enrolledQuizGroups: [
      {
        group: { type: mongoose.Schema.Types.ObjectId, ref: "QuizGroup" },
        joinedAt: { type: Date, default: Date.now },
        // per-group personal stats
        stats: {
          totalGames: { type: Number, default: 1 },
          totalScore: { type: Number, default: 10 },
          bestScore: { type: Number, default: 10 },
        },
      },
    ],

    // Requests pending to join groups
    joinRequests: [
      {
        group: { type: mongoose.Schema.Types.ObjectId, ref: "QuizGroup" },
        requestedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],

    // Enrolled courses with progress and completion
    enrolledCourses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        isComplete: { type: Boolean, default: false },
        progress: { type: [Boolean], default: [] },
        enrolledAt: { type: Date, default: Date.now },
      },
    ],

    // Discussions created by user
    createdDiscussions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Discussion" },
    ],

    // Profile info
    profile: {
      fullName: { type: String },
      bio: { type: String },
      avatarUrl: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
