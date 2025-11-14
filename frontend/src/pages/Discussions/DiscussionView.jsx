import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/discussionsApi.js";
import { useDiscussionContext } from "../../context/useDiscussionContext.js";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { ThumbsUp, ThumbsDown, Flag, UserCircle } from "lucide-react";
import { useStoredContext } from "../../context/useStoredContext.js";

export default function DiscussionView() {
  const { sectionKey, id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const { userId } = useDiscussionContext();
  const { user } = useStoredContext();

  useEffect(() => {
    api
      .getDiscussion(id)
      .then((d) => setDiscussion(d))
      .catch(console.error);
  }, [id]);

  const handleAnswerClick = () => {
    const hideReminder = localStorage.getItem("hideReminderAnswer");
    if (!hideReminder) setShowReminder(true);
    else submitAnswer();
  };

  const handleReminderClose = (dontShowAgain) => {
    setShowReminder(false);
    if (dontShowAgain) localStorage.setItem("hideReminderAnswer", "true");
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

  const syncAnswerWithBackend = async (answerId, type) => {
    try {
      await fetch(
        `http://localhost:5000/api/discussions/discussions/${id}/answers/${answerId}/${type}`,
        { method: "POST" }
      );
    } catch (err) {
      console.error(`Error syncing ${type}:`, err);
    }
  };

  const handleAnswerVote = (answerIndex, type) => {
    setDiscussion((prev) => {
      const updated = { ...prev };
      const ans = updated.answers[answerIndex];

      if (type === "upvote" && !ans.hasUpvoted) {
        ans.upvotes += 1;
        if (ans.hasDownvoted) ans.downvotes -= 1;
        ans.hasUpvoted = true;
        ans.hasDownvoted = false;
        syncAnswerWithBackend(ans.id, "upvote");
      } else if (type === "downvote" && !ans.hasDownvoted) {
        ans.downvotes += 1;
        if (ans.hasUpvoted) ans.upvotes -= 1;
        ans.hasDownvoted = true;
        ans.hasUpvoted = false;
        syncAnswerWithBackend(ans.id, "downvote");
      } else if (type === "report" && !ans.hasReported) {
        ans.report_count += 1;
        ans.hasReported = true;
        syncAnswerWithBackend(ans.id, "report");
      }

      return updated;
    });
  };

  if (!discussion) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg dark:bg-slate-800 shadow-sm">
        {/* --- Title --- */}
        <h1 className="text-2xl font-semibold dark:text-white mb-2">
          {discussion.title}
        </h1>

        {/* --- Author Info --- */}
        <div className="flex items-center gap-2 mb-4">
          {discussion.authorAvatar ? (
            <img
              src={discussion.authorAvatar}
              alt={discussion.authorName}
              className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600"
            />
          ) : (
            <UserCircle
              size={32}
              className="text-slate-400 dark:text-slate-300"
            />
          )}
          <div>
            <div className="font-medium text-slate-700 dark:text-slate-200">
              {discussion.authorName || "Anonymous"}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(discussion.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* --- Question Content --- */}
        <div
          className="prose max-w-none dark:prose-invert mb-6"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(discussion.question),
          }}
        />

        {/* --- Answers --- */}
        <div>
          <h3 className="font-semibold text-lg dark:text-white mb-2">
            Answers ({discussion.no_of_answers})
          </h3>

          {discussion.answers.length === 0 ? (
            <div className="text-gray-500 italic text-sm">
              Be the first to share your answer and help others in the
              community.
            </div>
          ) : (
            <div className="space-y-4">
              {discussion.answers.map((a, i) => (
                <div
                  key={a.id}
                  className="p-4 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {a.authorAvatar ? (
                      <img
                        src={a.authorAvatar}
                        alt={a.authorName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                      />
                    ) : (
                      <UserCircle
                        size={32}
                        className="text-slate-400 dark:text-slate-300"
                      />
                    )}
                    <div>
                      <div className="font-medium text-slate-700 dark:text-slate-200">
                        {a.authorName}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div
                    className="dark:text-white prose dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(a.answer),
                    }}
                  />

                  {/* --- Votes/Report --- */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-300">
                    <button
                      onClick={() => handleAnswerVote(i, "upvote")}
                      disabled={a.hasUpvoted}
                      className={`flex items-center gap-1 transition ${
                        a.hasUpvoted
                          ? "text-blue-600 dark:text-blue-400"
                          : "hover:text-blue-500"
                      }`}
                    >
                      <ThumbsUp size={14} /> {a.upvotes}
                    </button>

                    <button
                      onClick={() => handleAnswerVote(i, "downvote")}
                      disabled={a.hasDownvoted}
                      className={`flex items-center gap-1 transition ${
                        a.hasDownvoted
                          ? "text-red-500 dark:text-red-400"
                          : "hover:text-red-500"
                      }`}
                    >
                      <ThumbsDown size={14} /> {a.downvotes}
                    </button>

                    <button
                      onClick={() => handleAnswerVote(i, "report")}
                      disabled={a.hasReported}
                      className={`flex items-center gap-1 transition ${
                        a.hasReported
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "hover:text-yellow-600"
                      }`}
                    >
                      <Flag size={14} /> {a.report_count}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Answer Editor --- */}
        <div className="mt-6">
          <h4 className="font-semibold dark:text-white mb-2">Your Answer</h4>
          <ReactQuill
            theme="snow"
            value={answerText}
            onChange={setAnswerText}
            className="dark:bg-slate-900 dark:text-white rounded-lg"
            placeholder="Write your answer here..."
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
      </div>

      {/* --- Reminder Modal --- */}
      {showReminder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Before you post
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Please ensure your answer stays respectful and relevant.
              Inappropriate or offensive content may be flagged and reviewed by
              moderators. We appreciate your contribution to keeping discussions
              positive and helpful.
            </p>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    localStorage.setItem("hideReminderAnswer", e.target.checked)
                  }
                />
                Don’t show this reminder again
              </label>
              <button
                onClick={() => handleReminderClose()}
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
