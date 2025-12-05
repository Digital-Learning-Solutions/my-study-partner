import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function QuizSection({ videoUrl, title, id, courseId }) {
  console.log("Rendering Quiz Section for video:", title);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(null); // ✅ null → not finished, true → passed, false → failed
  const userId = localStorage.getItem("userId");
  console.log("User Id", userId);

  async function generateQuiz() {
    setLoading(true);
    setError("");

    try {
      const transcriptRes = await fetch(
        `${BACKEND_URL}/api/course/get-transcript`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl }),
        }
      );

      if (!transcriptRes.ok) throw new Error("Failed to fetch transcript");

      const transcriptData = await transcriptRes.json();
      const plainText = transcriptData.text;

      const formData = new FormData();
      formData.append("text", plainText);

      const quizRes = await fetch(`${BACKEND_URL}/api/upload-notes`, {
        method: "POST",
        body: formData,
      });

      if (!quizRes.ok) throw new Error("Failed to generate quiz");

      const quizData = await quizRes.json();

      if (quizData?.questions?.length > 0) {
        setQuestions(quizData.questions);
        setIndex(0);
        setScore(0);
        setFinished(false);
        setPassed(null);
        setStarted(true);
      } else {
        setError("No quiz could be generated from this video.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transcript or generate quiz. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function sendProgressUpdate() {
    try {
      await fetch(`${BACKEND_URL}/api/course/update-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: id, userId, courseId }),
      });
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  }

  function selectAnswer(i) {
    const current = questions[index];
    const isCorrect = current.answer === i;

    setScore((prev) => prev + (isCorrect ? 10 : 0));

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      const finalScore = score + (isCorrect ? 10 : 0);

      const didPass = finalScore >= 70; // ✅ Minimum 7 correct required

      setPassed(didPass);
      setFinished(true);
      setStarted(false);

      if (didPass) {
        sendProgressUpdate(); // ✅ Update progress only if passed
      }
    }
  }

  return (
    <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
        🧠 Quiz Section
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Generate an AI-powered quiz based on the video{" "}
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        .
      </p>

      {!started && !loading && !finished && (
        <button
          onClick={generateQuiz}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
        >
          Start Quiz
        </button>
      )}

      {loading && (
        <p className="mt-4 text-blue-600 dark:text-blue-400">
          ⏳ Generating Quiz...
        </p>
      )}

      {error && <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>}

      {/* Quiz in progress */}
      {started && questions.length > 0 && (
        <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner transition-colors">
          <div className="mb-2 text-sm text-slate-600 dark:text-slate-300 flex justify-between">
            <span>
              Question <strong>{index + 1}</strong> of{" "}
              <strong>{questions.length}</strong>
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Score: {score}
            </span>
          </div>

          <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">
            {questions[index].question}
          </h2>

          <div className="grid gap-3">
            {questions[index].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg text-left 
                hover:bg-indigo-50 dark:hover:bg-indigo-900 focus:ring-2 
                focus:ring-indigo-300 dark:focus:ring-indigo-600 transition-colors 
                text-gray-900 dark:text-gray-100"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Result Screen (Pass or Fail) */}
      {finished && (
        <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner transition-colors text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {passed ? "🎉 Quiz Passed!" : "❌ Quiz Failed"}
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Your Score:{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {score}
            </span>
            /100
          </p>

          {!passed && (
            <p className="text-red-500 mb-4">
              You need at least 70 to pass (7 correct answers).
            </p>
          )}

          <button
            onClick={() => {
              setFinished(false);
              setQuestions([]);
              setScore(0);
              setIndex(0);
              setPassed(null);
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      )}
    </section>
  );
}
