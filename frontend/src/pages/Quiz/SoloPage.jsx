import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function SoloPage() {
  console.log("Rendering Solo Quiz Page");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  async function generate() {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      else formData.append("text", notes);

      const res = await axios.post(
        `${BACKEND_URL}/api/upload-notes`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.questions?.length > 0) {
        setQuestions(res.data.questions);
        setIndex(0);
        setScore(0);
      } else {
        setError(
          "No questions were generated. Please check your notes or file."
        );
      }
    } catch (err) {
      setError("Failed to generate quiz. Please try again.", err);
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(i) {
    const current = questions[index];
    const isCorrect = current.answer === i;

    if (isCorrect) setScore((s) => s + 10);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      alert(`🎉 Quiz finished! Your score: ${score + (isCorrect ? 10 : 0)}`);
    }
  }

  return (
    <div className="relative min-h-screen px-4 py-10 flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-300">
      {/* Beautiful Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="
    absolute left-5 top-8
    px-4 py-2 rounded-lg flex items-center gap-2

    text-sm font-medium
  text-white

    bg-indigo-600 hover:bg-indigo-700


    transition-all duration-200
  "
      >
        ← Back
      </button>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 text-center">
        Solo{" "}
        <span className="text-indigo-600 dark:text-indigo-400">Quiz Mode</span>
      </h1>

      <p className="text-slate-600 dark:text-gray-300 text-center mb-10 max-w-2xl">
        Paste your notes or upload a file to generate an AI-powered quiz.
      </p>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition p-8 border border-gray-100 dark:border-gray-700 w-full max-w-3xl">
        {/* Notes Textarea */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none resize-none mb-5"
          placeholder="Paste your notes here..."
          rows={5}
        />

        {/* Drag & Drop File Upload */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("ring-2", "ring-indigo-400");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("ring-2", "ring-indigo-400");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("ring-2", "ring-indigo-400");
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) setFile(droppedFile);
          }}
          onClick={() => document.getElementById("fileInput").click()}
          className="
            flex flex-col items-center justify-center cursor-pointer
            border-2 border-dashed border-gray-300 dark:border-gray-600
            rounded-xl p-6 mb-5 transition-all bg-gray-50 dark:bg-gray-700
            hover:border-indigo-500 dark:hover:border-indigo-400
          "
        >
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Drag & drop a file here, or{" "}
            <span className="text-indigo-600 dark:text-indigo-400 underline">
              browse
            </span>
          </p>

          {file && (
            <p className="mt-3 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
              Selected: {file.name}
            </p>
          )}

          <input
            id="fileInput"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={loading}
          className={`w-full md:w-auto px-8 py-3 rounded-xl text-white font-semibold transition duration-200 ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Generating Quiz..." : "Generate Quiz"}
        </button>

        {error && (
          <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* Quiz Section */}
      {questions.length > 0 && (
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-sm mb-4 text-slate-600 dark:text-gray-300">
            <span>
              Question <strong>{index + 1}</strong> /{" "}
              <strong>{questions.length}</strong>
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Score: {score}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            {questions[index].question}
          </h2>

          <div className="grid gap-4">
            {questions[index].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className="
                  p-4 border border-gray-300 dark:border-gray-700 
                  rounded-xl text-left dark:text-white
                  hover:bg-indigo-50 dark:hover:bg-indigo-700
                  transition-colors
                "
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !loading && !error && (
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          No quiz generated yet. Upload file or paste notes and click{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Generate Quiz
          </span>
          .
        </p>
      )}
    </div>
  );
}
