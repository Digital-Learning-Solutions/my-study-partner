// backend/controllers/courseController.js

import Course from "../../models/CourseModel/Course.js";
import User from "../../models/UserModel/user.js";

export const enrollInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    console.log("userId:", userId, "courseId:", courseId);

    // ✅ Validate input
    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ message: "userId and courseId are required" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      console.log("User or Course not found");
      return res.status(404).json({ message: "User or Course not found" });
    }

    // ✅ Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses?.some(
      (c) => c.course.toString() === courseId
    );

    if (alreadyEnrolled) {
      console.log("User already enrolled in this course");

      return res.status(400).json({ message: "Already enrolled" });
    }
    console.log("user before:", user);

    // Compute total number of classes across all modules
    const totalClasses =
      (course.modules || []).reduce(
        (sum, mod) => sum + ((mod.classes && mod.classes.length) || 0),
        0
      ) || 0;

    // Initialize progress array of booleans (false = not completed)
    const progressArray = Array(totalClasses).fill(false);

    // Push course to user’s enrolled list with initialized progress
    user.enrolledCourses.push({
      course: course._id,
      progress: progressArray,
      isComplete: false,
      enrolledAt: new Date(),
    });
    await user.save();

    console.log("user before:", user);

    // ✅ Increment enroll count in course
    course.enrollCount += 1;
    await course.save();

    res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const rateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId, rating } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if user already rated
    const existing = course.ratings.find((r) => r.userId.toString() === userId);

    if (existing) {
      existing.rating = rating; // update
    } else {
      course.ratings.push({ userId, rating }); // add new rating
    }

    // Calculate new average
    const totalRatings = course.ratings.length;
    const avgRating = (
      course.ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings
    ).toFixed(1);

    course.rating = avgRating;
    await course.save();

    res.json({
      message: "Rating updated",
      newRating: avgRating,
      totalRatings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rating failed" });
  }
};
