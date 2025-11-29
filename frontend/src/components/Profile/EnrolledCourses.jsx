// src/components/Profile/EnrolledCourses.jsx
import React from "react";
import { BookOpen, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EnrolledCourses({ courses = [] }) {
  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <BookOpen className="w-5 h-5 text-white" />
        <h3 className="text-white text-lg font-semibold">Enrolled Courses</h3>
      </div>

      <div className="p-5">
        {/* NO COURSES */}
        {courses.length === 0 && (
          <p className="text-gray-500 dark:text-gray-300 text-center py-6">
            You haven’t enrolled in any courses yet.
          </p>
        )}

        {/* COURSE LIST */}
        <div className="space-y-4">
          {courses.map((c) => {
            const title = c?.course?.title || "Untitled Course";
            const instructor = c?.course?.instructor || "Unknown Instructor";
            const progress = Array.isArray(c.progress)
              ? Math.round(
                  (c.progress.filter(Boolean).length / c.progress.length) * 100
                ) || 0
              : 0;

            return (
              <Link
                to={`/courses/${c.course?.courseType}/${c.course?._id}`}
                key={c._id}
                className="block p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm"
              >
                {/* TOP ROW */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Instructor: {instructor}
                    </p>
                  </div>

                  {/* Progress number */}
                  <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    {progress}%
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* FOOTER */}
                <div className="flex justify-end mt-3">
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
