import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Users, Layers, Lock } from "lucide-react";
import { useStoredContext } from "../../context/useStoredContext";
import CourseRating from "../../components/CourseRating";

export default function CourseModulesPage() {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useStoredContext();

  // ---------- FETCH COURSE + USER ----------
  useEffect(() => {
    async function fetchCourseAndUser() {
      try {
        const courseRes = await fetch(
          `http://localhost:5000/api/course/get-course/${id}`
        );
        const courseData = await courseRes.json();
        const fetchedCourse = courseData.course;

        setCourse(fetchedCourse);
        console.log("User:", user);

        if (user) {
          const enrolled = user.enrolledCourses.some(
            (c) => String(c.course._id) === String(fetchedCourse._id)
          );
          setIsEnrolled(enrolled);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchCourseAndUser();
  }, [id, user]);

  // ---------- HANDLE ENROLL ----------
  async function handleEnroll() {
    if (!user) return alert("Please log in first!");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, courseId: course._id }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("✅ Enrolled successfully!");
        setIsEnrolled(true);
        setCourse((prev) => ({ ...prev, enrollCount: prev.enrollCount + 1 }));
      } else {
        alert(data.message || "Enrollment failed");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    } finally {
      setLoading(false);
    }
  }

  // ---------- LOADING UI ----------
  if (!course?.title) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading course details...
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen transition-colors">
      {/* ---------- HERO ---------- */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img
          src={course.image}
          alt={course.title}
          className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {course.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {course.description}
            </p>
          </div>

          <div className="flex items-center gap-6 mb-4 text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> {course.rating} / 5.0
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> {course.enrollCount}{" "}
              enrolled
            </span>
            <span className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-green-500" /> {course.moduleCount}{" "}
              modules
            </span>
          </div>

          {!isEnrolled ? (
            <button
              onClick={handleEnroll}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors w-fit"
            >
              {loading ? "Enrolling..." : "Enroll Now"}
            </button>
          ) : (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✅ Enrolled
            </span>
          )}
          <div className="mt-6  border-gray-300 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              ⭐ Rate this course
            </h3>
            <CourseRating
              courseId={course._id}
              ratings={course.ratings}
              isEnrolled={isEnrolled}
              onRated={(newAvg, userRating) => {
                setCourse((prev) => ({
                  ...prev,
                  rating: newAvg,
                  ratings: prev.ratings.map((r) =>
                    r.userId === user._id ? { ...r, rating: userRating } : r
                  ),
                }));
              }}
            />
          </div>
        </div>
      </div>

      {/* ---------- COURSE DETAILS ---------- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          📘 Course Overview
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
          {course.description}
        </p>
      </div>

      {/* ---------- MODULES GRID ---------- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          📚 Course Modules
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
          {!isEnrolled && (
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white rounded-xl z-10">
              <Lock className="w-10 h-10 mb-2" />
              <p className="text-lg font-medium">Enroll to unlock modules</p>
            </div>
          )}

          {course?.modules?.map((mod, index) => (
            <Link
              key={index}
              to={
                isEnrolled
                  ? `${mod.title.toLowerCase().split(" ").join("-")}`
                  : "#"
              }
              state={
                isEnrolled
                  ? {
                      classes: mod.classes,
                      title: mod.title,
                      content: mod.content,
                      courseId: course._id,
                    }
                  : null
              }
              onClick={(e) => {
                if (!isEnrolled) e.preventDefault();
              }}
            >
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-md transition-colors cursor-pointer flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {mod.content}
                  </p>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  📺 {mod.classCount} Classes
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
