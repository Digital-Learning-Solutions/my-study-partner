// src/pages/QuizPage.jsx

import React, { useState } from 'react';

const questions = [
  {
    questionText: 'What is the capital of France?',
    answerOptions: [
      { answerText: 'New York', isCorrect: false },
      { answerText: 'London', isCorrect: false },
      { answerText: 'Paris', isCorrect: true },
      { answerText: 'Dublin', isCorrect: false },
    ],
  },
  // Add more questions here...
];

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        {showScore ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">
              You scored {score} out of {questions.length}
            </h2>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-4">
                <span className="text-xl font-bold text-slate-800">Question {currentQuestion + 1}</span>
                <span className="text-slate-500">/{questions.length}</span>
              </div>
              <p className="text-lg text-slate-700">
                {questions[currentQuestion].questionText}
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {questions[currentQuestion].answerOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option.isCorrect)}
                  className="w-full text-left p-4 bg-slate-100 rounded-lg hover:bg-blue-100 border-2 border-transparent hover:border-blue-500 transition-all"
                >
                  {option.answerText}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default QuizPage;