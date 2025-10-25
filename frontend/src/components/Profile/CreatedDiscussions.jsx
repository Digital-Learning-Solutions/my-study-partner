// src/components/Profile/CreatedDiscussions.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, CalendarDays } from "lucide-react";

export default function CreatedDiscussions({ discussions = [] }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition hover:shadow-xl">
      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-4">
        <MessageSquare className="w-5 h-5 text-white" />
        <h3 className="text-white text-lg font-semibold">
          Created Discussions
        </h3>
      </div>

      <div className="p-4">
        {discussions.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-300 text-sm text-center py-4">
            No discussions created yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {discussions.map((d, index) => (
              <li
                key={index}
                className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Link
                  to={`/discussions/d/${d._id}`}
                  className="block text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {d.question || "Untitled Discussion"}
                </Link>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <CalendarDays className="w-3 h-3" />
                  {new Date(d.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
