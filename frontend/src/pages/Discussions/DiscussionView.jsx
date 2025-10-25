// src/pages/DiscussionView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/discussionsApi.js";
import { useDiscussion } from "../../context/DiscussionContext";

export default function DiscussionView() {
  console.log("view");

  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const { userId } = useDiscussion();

  useEffect(() => {
    api
      .getDiscussion(id)
      .then((d) => setDiscussion(d))
      .catch(console.error);
  }, [id]);

  const submitAnswer = async () => {
    if (!answerText.trim()) return alert("Write an answer");
    try {
      await api.addAnswer(id, {
        answer: answerText,
        authorId: userId || "anonymous",
        authorName: localStorage.getItem("userName") || "",
      });
      const fresh = await api.getDiscussion(id);
      setDiscussion(fresh);
      setAnswerText("");
    } catch (e) {
      console.error(e);
      alert("Unable to post");
    }
  };

  if (!discussion) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg dark:bg-slate-800">
        <h1 className="text-2xl font-semibold dark:text-white">
          {discussion.question}
        </h1>
        <div className="text-sm text-slate-500 mt-2 dark:text-slate-300">
          {discussion.authorName || discussion.authorId} •{" "}
          {new Date(discussion.createdAt).toLocaleString()}
        </div>
        <div className="mt-4">
          <h3 className="font-semibold dark:text-white">
            Answers ({discussion.no_of_answers})
          </h3>
          <div className="space-y-3 mt-3">
            {discussion.answers.map((a) => (
              <div key={a.id} className="p-3 border rounded dark:bg-slate-900">
                <div className="text-sm text-slate-500 dark:text-slate-300">
                  {a.author} • {new Date(a.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 dark:text-white">{a.answer}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded dark:bg-slate-900 dark:text-white"
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              onClick={submitAnswer}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Post Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
