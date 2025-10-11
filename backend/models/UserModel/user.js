import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ Enrolled courses with progress and completion
    enrolledCourses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        isComplete: { type: Boolean, default: false },
        progress: { type: Number, default: 0 }, // optional
        enrolledAt: { type: Date, default: Date.now },
      },
    ],

    // ✅ Discussions created by user
    createdDiscussions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Discussion" },
    ],

    // ✅ Profile info
    profile: {
      fullName: { type: String },
      bio: { type: String },
      avatarUrl: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
