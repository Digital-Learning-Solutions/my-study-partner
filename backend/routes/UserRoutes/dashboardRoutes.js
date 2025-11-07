import express from "express";
import User from "../../models/UserModel/User.js";
import Course from "../../models/CourseModel/Course.js";

const router = express.Router();

// GET /api/dashboard/:userId - aggregated stats for dashboard
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate({ path: "enrolledCourses.course", select: "title modules _id courseType slug subject" })
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const enrolled = user.enrolledCourses || [];
    const totalEnrolled = enrolled.length;
    const completedCourses = enrolled.filter((c) => c.isComplete).length;

    // Course progress average
    const avgCourseProgress = totalEnrolled
      ? Math.round(
          (enrolled.reduce((sum, c) => sum + (Number(c.progress) || 0), 0) /
            totalEnrolled) * 10
        ) / 10
      : 0;

    // Classes watched vs total (derived from modules/classes if available)
    let totalClasses = 0;
    let watchedClasses = 0;
    for (const ec of enrolled) {
      const courseDoc = ec.course;
      if (!courseDoc || !Array.isArray(courseDoc.modules)) continue;
      const classesInCourse = courseDoc.modules.reduce(
        (acc, m) => acc + (Array.isArray(m.classes) ? m.classes.length : 0),
        0
      );
      totalClasses += classesInCourse;
      watchedClasses += Math.round(classesInCourse * ((ec.progress || 0) / 100));
    }

    // Quiz stats from sockets runtime are ephemeral; maintain simple derived stats from user doc if later added.
    // For now, expose placeholders allowing UI to plug into sockets events to update in realtime.
    // Derive per-course quiz stats if available on user doc, else default to zeros
    const byCourse = Array.isArray(user.quizStatsByCourse)
      ? user.quizStatsByCourse.map((q) => ({
          courseId: q.courseId?.toString?.() || q.courseId,
          title: q.title || (enrolled.find((e) => e.course?._id?.toString?.() === q.courseId?.toString?.())?.course?.title) || 'Untitled',
          category: q.category || (enrolled.find((e) => e.course?._id?.toString?.() === q.courseId?.toString?.())?.course?.courseType) || '',
          attempts: Number(q.attempts) || 0,
          averageScore: Number(q.averageScore) || 0,
        }))
      : enrolled.map((e) => ({
          courseId: e.course?._id?.toString?.(),
          title: e.course?.title || 'Untitled',
          category: e.course?.courseType || '',
          attempts: 0,
          averageScore: 0,
        }));

    const quizStats = {
      totalQuizzesPlayed: user.quizStats?.played || 0,
      totalCorrect: user.quizStats?.correct || 0,
      averageScore: user.quizStats?.average || 0,
      byCourse,
    };

    return res.json({
      courses: {
        totalEnrolled,
        completedCourses,
        avgCourseProgress,
        totalClasses,
        watchedClasses,
        detail: enrolled.map((c) => ({
          id: c._id?.toString?.(),
          courseId: c.course?._id?.toString?.(),
          category: c.course?.courseType || c.course?.slug || "",
          subject: c.course?.subject || c.course?.courseType || "",
          title: c.course?.title || "Untitled",
          progress: Number(c.progress) || 0,
          isComplete: !!c.isComplete,
          enrolledAt: c.enrolledAt,
        })),
      },
      quiz: quizStats,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("/dashboard error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
