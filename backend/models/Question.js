import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: Number } // index of correct option
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);