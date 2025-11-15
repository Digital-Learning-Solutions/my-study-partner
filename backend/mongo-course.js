import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import CourseModel from "./models/CourseModel/Course.js"; // your mongoose course schema
import Course from "./database/CourseDatabase.js"; // your static JSON course array

dotenv.config();

const seedCourses = async () => {
  try {
    await connectDB();

    // Optional: Clear all courses
    await CourseModel.deleteMany({});
    console.log("Existing courses deleted ✅");

    await CourseModel.insertMany(Course);
    console.log("Courses inserted successfully ✅");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting courses:", error);
    await mongoose.disconnect();
  }
};

seedCourses();
