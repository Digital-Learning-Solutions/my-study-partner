// backend/models/Discussion.js
import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  answer: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  report_count: { type: Number, default: 0 },
  is_highlighted: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

const DiscussionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  section: { type: String, required: true }, // which section key (frontend/backend/cloud)
  question: { type: String, required: true },
  authorId: { type: String, required: true }, // store user id
  authorName: { type: String },
  createdAt: { type: Date, default: Date.now },
  no_of_answers: { type: Number, default: 0 },
  report_count: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  answers: { type: [AnswerSchema], default: [] },
});

export default mongoose.models.Discussion ||
  mongoose.model("Discussion", DiscussionSchema);
