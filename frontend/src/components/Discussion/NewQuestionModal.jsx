// src/components/NewQuestionModal.jsx
import React, { useState } from "react";
import { useDiscussion } from "../../context/DiscussionContext";
import { useStoredContext } from "../../context/useStoredContext";

export default function NewQuestionModal({ section, onClose, onCreated }) {
  const { createDiscussion, userId } = useDiscussion();
  const { user } = useStoredContext();
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState("");

  const submit = async () => {
    if (!question.trim()) return alert("Write a question");
    try {
      const payload = {
        section,
        question,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        authorId: userId || "anonymous",
        authorName: user?.profile?.fullName || "",
      };
      await createDiscussion(payload);
      onCreated && onCreated();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Could not create");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">
          New question in {section}
        </h3>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded mb-2 dark:bg-slate-900 dark:text-white"
        ></textarea>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tags comma separated"
          className="w-full p-2 border rounded mb-3 dark:bg-slate-900 dark:text-white"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
