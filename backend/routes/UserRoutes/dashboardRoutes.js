// routes/dashboard.js
import express from "express";
import User from "../../models/UserModel/user.js";
const dashboardRoutes = express.Router();

dashboardRoutes.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).lean().populate({
      path: "enrolledCourses.course",
      model: "Course",
      select: "title category subject content slug _id",
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Build enriched courses detail
    const enriched = (user.enrolledCourses || []).map((ec) => {
      const course = ec.course || {};
      // If course.content is an array of lessons/classes
      const totalClasses = Array.isArray(course.content)
        ? course.content.length
        : Number(course.totalClasses) || 0;

      // ec.progress is array of booleans per lesson
      const watchedClasses = Array.isArray(ec.progress)
        ? ec.progress.filter(Boolean).length
        : Number(ec.watchedClasses || 0);

      const progressPercentage =
        totalClasses > 0
          ? Math.round((watchedClasses / totalClasses) * 100)
          : 0;

      return {
        courseId: course._id || ec.course,
        title: course.title || course.name || "Untitled Course",
        category: course.category || course.slug || "general",
        subject: course.subject || "",
        totalClasses,
        watchedClasses,
        progressPercentage,
        enrolledAt: ec.enrolledAt,
        isComplete: ec.isComplete || progressPercentage >= 100,
        courseLink: course.slug
          ? `/courses/${encodeURIComponent(course.category || "general")}/${
              course.slug
            }`
          : `/courses/${course._id}`,
      };
    });

    const totalEnrolled = enriched.length;
    const completedCourses = enriched.filter(
      (c) => c.progressPercentage >= 100 || c.isComplete
    ).length;
    const avgCourseProgress = totalEnrolled
      ? Math.round(
          enriched.reduce((s, c) => s + c.progressPercentage, 0) / totalEnrolled
        )
      : 0;
    const totalClasses = enriched.reduce(
      (s, c) => s + (c.totalClasses || 0),
      0
    );
    const watchedClasses = enriched.reduce(
      (s, c) => s + (c.watchedClasses || 0),
      0
    );

    // Quiz stats - adjust according to your schema (fallbacks)
    const quizStats = user.quizStats || {
      totalQuizzesPlayed: 0,
      totalCorrect: 0,
      averageScore: 0,
      byCourse: [],
    };

    // Discussions - fallback if stored differently
    const discussions = { enrolled: user.joinedDiscussions || [] };

    return res.json({
      courses: {
        detail: enriched,
        totalEnrolled,
        completedCourses,
        avgCourseProgress,
        totalClasses,
        watchedClasses,
      },
      quiz: quizStats,
      discussions,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("Dashboard route error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default dashboardRoutes;
