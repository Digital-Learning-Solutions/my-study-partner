// --- Only Modified/Added Code is Marked With COMMENTS ---

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/discussionsApi.js";
import { useDiscussionContext } from "../../context/useDiscussionContext.js";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  UserCircle,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import { useStoredContext } from "../../context/useStoredContext.js";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function DiscussionView() {
  console.log("Rendering Discussion View Page");
  const { sectionKey, id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [showReminder, setShowReminder] = useState(false);

  const { userId } = useDiscussionContext();
  const { user } = useStoredContext();

  // Load Discussion
  useEffect(() => {
    api.getDiscussion(id).then(setDiscussion).catch(console.error);
  }, [id]);

  // Submit Answer
  const handleAnswerClick = () => {
    const hideReminder = localStorage.getItem("hideReminderAnswer");
    if (!hideReminder) setShowReminder(true);
    else submitAnswer();
  };

  const handleReminderClose = () => {
    setShowReminder(false);
    submitAnswer();
  };

  const submitAnswer = async () => {
    const plainText = answerText.replace(/<[^>]+>/g, "").trim();
    if (!plainText) {
      alert("Please write your answer before posting.");
      return;
    }

    try {
      await api.addAnswer(id, {
        answer: answerText,
        authorId: userId || "anonymous",
        authorName: user?.profile?.fullName || "",
        authorAvatar: user?.profile?.avatarUrl || "",
        email: user?.email || "",
        sectionKey,
        discussionId: id,
      });

      const fresh = await api.getDiscussion(id);
      setDiscussion(fresh);
      setAnswerText("");
    } catch (e) {
      console.error(e);
      alert("Unable to post your answer. Please try again later.");
    }
  };

  // --- Edit Answer ---
  const startEdit = (index, answerHTML) => {
    setEditingIndex(index);
    setEditedAnswer(answerHTML);
  };

  const saveEdit = async (answerId) => {
    try {
      await api.updateAnswer(id, answerId, { answer: editedAnswer });

      const fresh = await api.getDiscussion(id);
      setDiscussion(fresh);
      setEditingIndex(null);
      setEditedAnswer("");
    } catch (err) {
      alert("Failed to update answer", err);
    }
  };

  const deleteAnswer = async (answerId) => {
    if (!window.confirm("Delete this answer?")) return;

    try {
      await api.deleteAnswer(id, answerId);
      const fresh = await api.getDiscussion(id);
      setDiscussion(fresh);
    } catch (err) {
      alert("Failed to delete", err);
    }
  };

  const highlightAnswer = async (answerId) => {
    try {
      await api.highlightAnswer(id, answerId);
      const fresh = await api.getDiscussion(id);
      setDiscussion(fresh);
    } catch (err) {
      alert("Unable to highlight", err);
    }
  };

  // --- Voting Sync ---
  const syncAnswerWithBackend = async (answerId, type) => {
    try {
      await fetch(
        `${BACKEND_URL}/api/discussions/discussions/${id}/answers/${answerId}/${type}`,
        { method: "POST" }
      );
    } catch (err) {
      console.error("Failed to sync vote/report with backend", err);
    }
  };

  const handleAnswerVote = (answerIndex, type) => {
    setDiscussion((prev) => {
      const updated = { ...prev };
      const ans = updated.answers[answerIndex];

      if (type === "upvote" && !ans.hasUpvoted) {
        ans.upvotes++;
        if (ans.hasDownvoted) ans.downvotes--;
        ans.hasUpvoted = true;
        ans.hasDownvoted = false;
        syncAnswerWithBackend(ans.id, "upvote");
      } else if (type === "downvote" && !ans.hasDownvoted) {
        ans.downvotes++;
        if (ans.hasUpvoted) ans.upvotes--;
        ans.hasDownvoted = true;
        ans.hasUpvoted = false;
        syncAnswerWithBackend(ans.id, "downvote");
      } else if (type === "report" && !ans.hasReported) {
        ans.report_count++;
        ans.hasReported = true;
        syncAnswerWithBackend(ans.id, "report");
      }
      return updated;
    });
  };

  if (!discussion) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* --- Discussion Box --- */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
        {/* Title */}
        <h1 className="text-2xl font-semibold dark:text-white">
          {discussion.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-2 mt-3 mb-4">
          {discussion.authorAvatar ? (
            <img
              src={discussion.authorAvatar}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <UserCircle size={40} className="text-slate-400" />
          )}

          <div>
            <p className="font-medium dark:text-white">
              {discussion.authorName}
            </p>
            <p className="text-sm text-slate-500">
              {new Date(discussion.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Question */}
        <div
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(discussion.question),
          }}
        />
      </div>

      {/* --- ANSWERS LIST --- */}
      <div className="mt-6">
        <h3 className="font-semibold text-xl dark:text-white mb-2">
          Answers ({discussion.no_of_answers})
        </h3>

        {discussion.answers.map((a, i) => (
          <div
            key={a.id}
            className={`p-4 rounded-lg border shadow-sm dark:bg-slate-900 mb-4 relative
              ${
                a.is_highlighted
                  ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                  : ""
              }`}
          >
            {/* Highlight Badge */}
            {a.is_highlighted && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                <Star size={14} /> Highlighted Answer
              </div>
            )}

            {/* Author Row */}
            <div className="flex items-center gap-3 mb-3">
              {a.authorAvatar ? (
                <img
                  src={a.authorAvatar}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <UserCircle size={36} className="text-slate-400" />
              )}

              <div>
                <p className="font-medium dark:text-white">{a.authorName}</p>
                <p className="text-sm text-slate-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* --- Answer Content (View or Edit Mode) --- */}
            {editingIndex === i ? (
              <ReactQuill
                theme="snow"
                value={editedAnswer}
                onChange={setEditedAnswer}
                className="dark:bg-slate-800"
              />
            ) : (
              <div
                className="prose dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(a.answer),
                }}
              />
            )}

            {/* --- Actions Row --- */}
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              {/* Voting buttons */}
              <button
                onClick={() => handleAnswerVote(i, "upvote")}
                disabled={a.hasUpvoted}
                className={`flex items-center gap-1 ${
                  a.hasUpvoted ? "text-blue-600" : "hover:text-blue-500"
                }`}
              >
                <ThumbsUp size={16} /> {a.upvotes}
              </button>

              <button
                onClick={() => handleAnswerVote(i, "downvote")}
                disabled={a.hasDownvoted}
                className={`flex items-center gap-1 ${
                  a.hasDownvoted ? "text-red-500" : "hover:text-red-500"
                }`}
              >
                <ThumbsDown size={16} /> {a.downvotes}
              </button>

              <button
                onClick={() => handleAnswerVote(i, "report")}
                disabled={a.hasReported}
                className={`flex items-center gap-1 ${
                  a.hasReported ? "text-yellow-600" : "hover:text-yellow-600"
                }`}
              >
                <Flag size={16} /> {a.report_count}
              </button>

              {/* --- Edit/Delete: Only Answer Owner --- */}
              {a.authorId === userId && (
                <>
                  {editingIndex === i ? (
                    <button
                      onClick={() => saveEdit(a.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(i, a.answer)}
                      className="flex items-center gap-1 hover:text-blue-500"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                  )}

                  <button
                    onClick={() => deleteAnswer(a.id)}
                    className="flex items-center gap-1 hover:text-red-500"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </>
              )}

              {/* --- Highlight Button: Only Discussion Author --- */}
              {discussion.authorId === userId && !a.is_highlighted && (
                <button
                  onClick={() => highlightAnswer(a.id)}
                  className="flex items-center gap-1 text-yellow-600 hover:text-yellow-500"
                >
                  <Star size={16} /> Highlight
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- Answer Editor at Bottom --- */}
      <div className="mt-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <h4 className="font-semibold dark:text-white mb-2">Your Answer</h4>

        <ReactQuill
          theme="snow"
          value={answerText}
          onChange={setAnswerText}
          className="dark:bg-slate-900"
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={handleAnswerClick}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Post Answer
          </button>
        </div>
      </div>

      {/* Reminder Modal - SAME AS YOURS */}
      {showReminder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Before you post
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Please ensure your answer stays respectful and relevant.
            </p>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    localStorage.setItem("hideReminderAnswer", e.target.checked)
                  }
                />
                Don’t show again
              </label>

              <button
                onClick={handleReminderClose}
                className="bg-blue-600 text-white px-4 py-1.5 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
