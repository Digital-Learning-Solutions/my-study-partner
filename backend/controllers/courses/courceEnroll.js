// backend/controllers/courseController.js

import Course from "../../models/CourseModel/Course.js";
import User from "../../models/UserModel/User.js";

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

    // ✅ Push course to user’s enrolled list
    user.enrolledCourses.push({ course: course._id, isComplete: false });
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
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Invalid rating" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Average rating (simple incremental average)
    course.ratingCount = (course.ratingCount || 0) + 1;
    course.totalRating = (course.totalRating || 0) + rating;
    course.rating = Number(
      (course.totalRating / course.ratingCount).toFixed(1)
    );

    await course.save();

    res.status(200).json({
      message: "Rating added successfully",
      newRating: course.rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
