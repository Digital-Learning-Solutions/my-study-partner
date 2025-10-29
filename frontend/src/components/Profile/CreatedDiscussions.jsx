// src/components/Profile/CreatedDiscussions.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  CalendarDays,
  Loader2,
  ThumbsUp,
  MessageCircle,
  Tag,
} from "lucide-react";

export default function CreatedDiscussions({ userId }) {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCreatedDiscussions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/discussions/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch created discussions");

        const data = await res.json();
        // user.discussions is not nested, it's inside createdDiscussions
        setDiscussions(data.discussions || []);
      } catch (err) {
        console.error("Error fetching created discussions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedDiscussions();
  }, [userId]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
        <MessageSquare className="w-5 h-5 text-white" />
        <h3 className="text-white text-lg font-semibold">
          Created Discussions
        </h3>
      </div>

      <div className="p-4">
        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-6 text-slate-500 dark:text-slate-300">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading
            discussions...
          </div>
        ) : discussions.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-300 text-sm text-center py-4">
            No discussions created yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {discussions.map((d, index) => (
              <li
                key={d._id || index}
                className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Link
                  to={`/discussions/section/${encodeURIComponent(d.section)}/${
                    d.id
                  }`}
                  className="block text-blue-600 dark:text-blue-400 font-semibold hover:underline text-base"
                >
                  {d.title || "Untitled Discussion"}
                </Link>

                {/* Meta info row */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {d.no_of_answers ?? 0} Answers
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {d.upvotes ?? 0} Upvotes
                  </span>
                </div>

                {/* Tags */}
                {d.tags && d.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {d.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
