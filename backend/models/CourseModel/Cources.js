import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  courceType: { type: String },
  image: { type: String },
  enrollCount: { type: Number, default: 4.2 },
  rating: { type: Number, default: 0 },
  moduleCount: { type: Number, default: 0 },
  modules: {
    type: [
      {
        id: { type: Number, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        classCount: { type: Number, required: true },
        classes: [
          {
            id: { type: Number, required: true },
            title: { type: String, required: true },
            duration: { type: Number, required: true },
            videoUrl: { type: String, required: true },
          },
        ],
      },
    ],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
