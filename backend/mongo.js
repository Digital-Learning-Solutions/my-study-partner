import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import Section from "./models/DiscussionModel/Section.js";
import { staticSections } from "./models/DiscussionModel/Section.js";

dotenv.config();

const seedSections = async () => {
  try {
    await connectDB();

    // Optional: Clear existing data
    await Section.deleteMany({});
    console.log("Existing sections deleted ✅");

    // Insert static data
    await Section.insertMany(staticSections);
    console.log("Sections inserted successfully ✅");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting sections:", error);
    mongoose.disconnect();
  }
};

seedSections();
