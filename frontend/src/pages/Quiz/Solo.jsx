import React, { useState } from "react";
import axios from "axios";

export default function Solo() {
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      else formData.append("text", notes);

      const res = await axios.post(
        "http://localhost:5000/api/upload-notes",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setQuestions(res.data.questions);
      setIndex(0);
      setScore(0);
    } catch {
      alert("Generation failed");
    }
    setLoading(false);
  }

  function selectAnswer(i) {
    const q = questions[index];
    if (q.answer === i) setScore((s) => s + 10);
    if (index + 1 < questions.length) setIndex(index + 1);
    else alert(`Quiz finished. Score: ${score + (q.answer === i ? 10 : 0)}`);
  }

  return (
    <div className="dark:bg-gray-900 dark:text-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Solo Mode</h1>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 w-full p-2 mb-2 rounded"
        placeholder="Paste your notes here (or upload a file below)"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2 text-gray-700 dark:text-gray-200"
      />

      <div className="space-x-2 mb-4">
        <button
          onClick={generate}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate from Notes/File"}
        </button>
      </div>

      {questions.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No questions loaded — generate from notes or file above.
        </p>
      ) : (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">
            Question {index + 1} / {questions.length}
          </div>
          <h2 className="font-semibold">{questions[index].question}</h2>
          <div className="mt-4 grid gap-2">
            {questions[index].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className="text-left p-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-slate-50 dark:hover:bg-gray-700"
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-4">Score: {score}</div>
        </div>
      )}
    </div>
  );
}
