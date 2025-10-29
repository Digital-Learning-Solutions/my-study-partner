import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: "📚" },
  tags: [{ type: String }],
  slug: { type: String, required: true, unique: true },
});

const Section = mongoose.model("Section", SectionSchema);

export default Section;
