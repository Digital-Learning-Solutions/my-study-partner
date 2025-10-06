import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  quesion: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  no_of_answers: { type: Number, default: 0 },
  report_count: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  answers: {
    type: [
      {
        id: { type: Number, required: true },
        answer: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        report_count: { type: Number, default: 0 },
        is_highlighted: { type: Boolean, default: false },
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
      },
    ],
  },
});

export default mongoose.models.Discussion ||
  mongoose.model("Discussion", DiscussionSchema);
