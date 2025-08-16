import React, { useState } from 'react'
import axios from 'axios'

export default function Solo() {
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState(null)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)

  async function generate() {
  setLoading(true)
  try {
    const formData = new FormData()
    if (file) formData.append('file', file)
    else formData.append('text', notes)

    const res = await axios.post('http://localhost:5000/api/upload-notes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    setQuestions(res.data.questions)
    setIndex(0)
    setScore(0)
  } catch (err) {
    alert('Generation failed')
  }
  setLoading(false)
}


  function selectAnswer(i) {
    const q = questions[index]
    if (q.answer === i) setScore(s => s + 10)
    if (index + 1 < questions.length) setIndex(index + 1)
    else alert(`Quiz finished. Score: ${score + (q.answer === i ? 10 : 0)}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Solo Mode</h1>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="border w-full p-2 mb-2"
        placeholder="Paste your notes here (or upload a file below)"
      />

      <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-2" />

      <div className="space-x-2 mb-4">
        <button onClick={generate} className="px-3 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
          {loading ? 'Generating...' : 'Generate from Notes/File'}
        </button>
      </div>

      {questions.length === 0 ? (
        <p className="text-sm">No questions loaded — generate from notes or file above.</p>
      ) : (
        <div className="p-4 bg-white rounded shadow">
          <div className="mb-2 text-sm text-slate-600">
            Question {index + 1} / {questions.length}
          </div>
          <h2 className="font-semibold">{questions[index].question}</h2>
          <div className="mt-4 grid gap-2">
            {questions[index].options.map((opt, i) => (
              <button key={i} onClick={() => selectAnswer(i)} className="text-left p-3 border rounded hover:bg-slate-50">
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-4">Score: {score}</div>
        </div>
      )}
    </div>
  )
}
