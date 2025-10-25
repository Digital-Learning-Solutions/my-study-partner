// src/components/Profile/EnrolledCourses.jsx
import React from "react";
import { BookOpen, TrendingUp } from "lucide-react";

export default function EnrolledCourses({ courses = [] }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition hover:shadow-xl">
      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-4">
        <BookOpen className="w-5 h-5 text-white" />
        <h3 className="text-white text-lg font-semibold">Enrolled Courses</h3>
      </div>

      <div className="p-4">
        {courses.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-300 text-sm text-center py-4">
            You haven’t enrolled in any courses yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {courses.map((c) => (
              <li
                key={c._id}
                className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">
                    {c.course?.title || "Untitled Course"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Instructor: {c.course?.instructor || "Unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  {c.progress || 0}%
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
