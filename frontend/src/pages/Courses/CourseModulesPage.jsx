import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Users, Layers } from "lucide-react";

export default function CourseModulesPage() {
  const { id } = useParams();
  const [course, setCourse] = useState({});

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(
          `http://localhost:5000/course/get-course/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch course");
        const data = await response.json();
        console.log(data.course);
        setCourse(data.course);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    }

    fetchCourse();
  }, [id]);

  if (!course?.title) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen transition-colors">
      {/* ---------- HERO SECTION ---------- */}
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
              <Star className="w-5 h-5 text-yellow-400" />
              {course.rating} / 5.0
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              {course.enrollCount} enrolled
            </span>
            <span className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-green-500" />
              {course.moduleCount} modules
            </span>
          </div>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors w-fit">
            Enroll Now
          </button>
        </div>
      </div>

      {/* ---------- COURSE DETAILS ---------- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          📘 Course Overview
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
          This course provides a solid foundation in algebraic concepts and
          problem-solving. You’ll start with understanding variables,
          expressions, and equations, and gradually move toward mastering key
          topics that form the backbone of higher mathematics.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Each module is carefully structured with video classes, interactive
          examples, and quizzes to test your understanding.
        </p>
      </div>

      {/* ---------- MODULES GRID ---------- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          📚 Course Modules
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {course?.modules?.map((mod) => (
            <Link
              key={mod.id}
              to={`${mod.title.toLowerCase().split(" ").join("-")}`}
              state={{
                classes: mod.classes,
                title: mod.title,
                content: mod.content,
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
