// src/components/DiscussionForm.jsx
import { useState } from "react";

export default function DiscussionForm({ onPost }) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    onPost({
      author: "User123",
      question,
      time: new Date().toLocaleString(),
    });
    setQuestion("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
    >
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
      />
      <button
        type="submit"
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Post
      </button>
    </form>
  );
}
