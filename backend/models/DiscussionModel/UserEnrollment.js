// backend/models/UserEnrollment.js
import mongoose from "mongoose";

const UserEnrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  sections: { type: [String], default: [] }, // list of section keys the user is enrolled in
});

export default mongoose.models.UserEnrollment ||
  mongoose.model("UserEnrollment", UserEnrollmentSchema);
