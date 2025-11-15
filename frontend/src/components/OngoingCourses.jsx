// src/components/Courses/OngoingCourses.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function OngoingCourses({ enrolledCourses = [] }) {
  console.log("Ongoing courses - enrolledCourses:", enrolledCourses);

  // Calculate total classes
  const getTotalClasses = (course) => {
    if (!course?.modules) return 0;
    return course.modules.reduce(
      (sum, m) => sum + (m.classCount || m.classes?.length || 0),
      0
    );
  };

  // Calculate % progress
  const calculateProgress = (progressArray, totalClasses) => {
    if (!Array.isArray(progressArray) || totalClasses === 0) return 0;
    const completed = progressArray.filter(Boolean).length;
    return Math.round((completed / totalClasses) * 100);
  };

  // Filter only ongoing courses
  const ongoing = enrolledCourses.filter((ec) => {
    if (!ec || !ec.course) return false;
    const total = getTotalClasses(ec.course);
    const isNotComplete = !ec.isComplete;
    console.log(
      "Course check:",
      ec.course.title,
      "Total:",
      total,
      "Complete:",
      ec.isComplete
    );
    return isNotComplete && total > 0;
  });

  console.log("Filtered ongoing courses:", ongoing);

  if (ongoing.length === 0) {
    console.log("No ongoing courses to display");
    return null;
  }

  return (
    <div className="mt-16 px-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Continue Learning
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {ongoing.map((ec) => {
          const course = ec.course;
          const totalClasses = getTotalClasses(course);
          const progress = calculateProgress(ec.progress || [], totalClasses);

          const link = `/courses/${course.courseType || course.slug}/${
            course._id
          }`;

          return (
            <Link
              key={ec._id}
              to={link}
              className="group bg-white dark:bg-slate-800 rounded-xl p-5 shadow hover:shadow-xl transition-all border dark:border-slate-700"
            >
              {/* Course Title */}
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 transition">
                {course.title || "Untitled Course"}
              </h3>

              {/* Progress Text */}
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                {progress}% complete (
                {(ec.progress || []).filter(Boolean).length} / {totalClasses}{" "}
                classes)
              </p>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Thumbnail / Placeholder */}
              <div className="mt-4 rounded-lg overflow-hidden h-32 bg-slate-100 dark:bg-slate-700">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl opacity-20">
                    📘
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
