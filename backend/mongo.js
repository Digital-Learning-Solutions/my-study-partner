import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/CourseModel/Course.js";
import CourseDatabase from "./database/CourseDatabase.js";
import connectDB from "./config/database.js";

dotenv.config();

const seedCourses = async () => {
  try {
    connectDB();

    // Optional: Remove existing courses to avoid duplicates
    await Course.deleteMany({});
    console.log("Existing courses deleted");

    // Map your Course array to match schema property names
    const mappedCourses = CourseDatabase.map((c) => ({
      title: c.title,
      description: c.description,
      courseType: c.courceType, // map courceType → courseType
      image: c.image,
      enrollCount: c.enrollCount,
      rating: c.rating,
      moduleCount: c.moduleCount,
      modules: c.modules,
    }));

    await Course.insertMany(mappedCourses);
    console.log("Courses inserted successfully ✅");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting courses:", error);
    mongoose.disconnect();
  }
};

seedCourses();
