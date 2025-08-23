import React, { useState } from 'react';
import axios from 'axios';

export default function SoloPage() {
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      else formData.append('text', notes);

      const res = await axios.post('http://localhost:5000/api/upload-notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.questions?.length > 0) {
        setQuestions(res.data.questions);
        setIndex(0);
        setScore(0);
      } else {
        setError('No questions were generated. Please check your notes or file.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate quiz. Please try again.');
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
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 text-center">
        Solo Mode Quiz
      </h1>
      <p className="text-slate-600 text-center mb-8">
        Paste your notes or upload a file to generate an AI-powered quiz.
      </p>

      {/* Input Section */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border rounded-lg w-full p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          placeholder="Paste your notes here (or upload a file below)"
          rows={5}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block mb-3 text-sm text-slate-600"
        />

        <button
          onClick={generate}
          disabled={loading}
          className={`w-full md:w-auto px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>

        {error && <p className="mt-3 text-red-600">{error}</p>}
      </div>

      {/* Quiz Section */}
      {questions.length > 0 && (
        <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
          <div className="mb-2 text-sm text-slate-600 flex justify-between">
            <span>
              Question <strong>{index + 1}</strong> of <strong>{questions.length}</strong>
            </span>
            <span className="text-indigo-600 font-semibold">Score: {score}</span>
          </div>

          <h2 className="font-bold text-lg mb-4">{questions[index].question}</h2>

          <div className="grid gap-3">
            {questions[index].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className="p-3 border rounded-lg text-left hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-300 transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !loading && !error && (
        <p className="mt-8 text-center text-slate-500 text-sm">
          No quiz generated yet. Paste notes or upload a file and click{" "}
          <strong>"Generate Quiz"</strong> to start.
        </p>
      )}
    </div>
  );
}
