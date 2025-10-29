import React, { useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  UserCircle,
} from "lucide-react";

export default function DiscussionCard({ d }) {
  const [upvotes, setUpvotes] = useState(d.upvotes || 0);
  const [downvotes, setDownvotes] = useState(d.downvotes || 0);
  const [reports, setReports] = useState(d.report_count || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  const sanitizedQuestion = DOMPurify.sanitize(d.question || "");

  const syncWithBackend = async (type) => {
    try {
      await fetch(
        `http://localhost:5000/api/discussions/discussions/${d.id}/${type}`,
        { method: "POST" }
      );
    } catch (err) {
      console.error(`Error syncing ${type}:`, err);
    }
  };

  const handleVote = (type) => {
    if (type === "upvote" && !hasUpvoted) {
      setUpvotes((prev) => prev + 1);
      if (hasDownvoted) setDownvotes((prev) => prev - 1);
      setHasUpvoted(true);
      setHasDownvoted(false);
      syncWithBackend("upvote");
    } else if (type === "downvote" && !hasDownvoted) {
      setDownvotes((prev) => prev + 1);
      if (hasUpvoted) setUpvotes((prev) => prev - 1);
      setHasDownvoted(true);
      setHasUpvoted(false);
      syncWithBackend("downvote");
    } else if (type === "report" && !hasReported) {
      setReports((prev) => prev + 1);
      setHasReported(true);
      syncWithBackend("report");
    }
  };

  return (
    <article className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
      {/* --- Header --- */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          {/* --- Title --- */}
          <Link
            to={`/discussions/section/${encodeURIComponent(
              d.sectionKey || d.section || "general"
            )}/${d.id}`}
            className="text-xl font-semibold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            {d.title?.trim() || "Untitled Question"}
          </Link>

          {/* --- Question Body --- */}
          <div
            className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6"
            dangerouslySetInnerHTML={{
              __html:
                sanitizedQuestion.trim() ||
                "<p><em>No question content provided.</em></p>",
            }}
          ></div>

          {/* --- Author Info --- */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300 mt-2">
            {d.authorAvatar ? (
              <img
                src={d.authorAvatar}
                alt={d.authorName}
                className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-600"
              />
            ) : (
              <UserCircle
                size={20}
                className="text-slate-400 dark:text-slate-300"
              />
            )}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {d.authorName?.trim() || "Anonymous"}
            </span>
            <span>
              •{" "}
              {d.createdAt
                ? new Date(d.createdAt).toLocaleString()
                : "Unknown date"}
            </span>
          </div>
        </div>

        {/* --- Votes --- */}
        <div className="flex flex-col items-end gap-2 text-slate-500 dark:text-slate-300 text-sm">
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            {d.no_of_answers || 0} answers
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <button
              onClick={() => handleVote("upvote")}
              disabled={hasUpvoted}
              className={`flex items-center gap-1 transition ${
                hasUpvoted
                  ? "text-blue-600 dark:text-blue-400"
                  : "hover:text-blue-500"
              }`}
            >
              <ThumbsUp size={14} /> {upvotes}
            </button>

            <button
              onClick={() => handleVote("downvote")}
              disabled={hasDownvoted}
              className={`flex items-center gap-1 transition ${
                hasDownvoted
                  ? "text-red-500 dark:text-red-400"
                  : "hover:text-red-500"
              }`}
            >
              <ThumbsDown size={14} /> {downvotes}
            </button>

            <button
              onClick={() => handleVote("report")}
              disabled={hasReported}
              className={`flex items-center gap-1 transition ${
                hasReported
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "hover:text-yellow-600"
              }`}
            >
              <Flag size={14} /> {reports}
            </button>
          </div>
        </div>
      </div>

      {/* --- Tags --- */}
      <div className="flex flex-wrap gap-2 mt-3">
        {Array.isArray(d.tags) && d.tags.length > 0 ? (
          d.tags.map((t, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-full"
            >
              #{t}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">No tags</span>
        )}
      </div>

      {/* --- Footer --- */}
      <div className="mt-4 text-right">
        <Link
          to={`/discussions/section/${encodeURIComponent(
            d.sectionKey || d.section || "general"
          )}/${d.id}`}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          View Discussion →
        </Link>
      </div>
    </article>
  );
}
