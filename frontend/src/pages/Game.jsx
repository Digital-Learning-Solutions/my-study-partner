import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'

const SOCKET_URL = 'http://localhost:5000'

export default function Game(){
  const { code } = useParams()
  const [socket, setSocket] = useState(null)
  const [players, setPlayers] = useState([])
  const [question, setQuestion] = useState(null)
  const [index, setIndex] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [questionsBank, setQuestionsBank] = useState([])

  useEffect(()=>{
    const s = io(SOCKET_URL)
    setSocket(s)
    const name = sessionStorage.getItem('playerName') || 'Guest'
    s.emit('join-room', { code, name }, (res) => {} )

    s.on('room-update', ({ players }) => setPlayers(players))
    s.on('new-question', ({ question, index }) => { setQuestion(question); setIndex(index) })
    s.on('leaderboard', ({ players }) => setLeaderboard(players))
    s.on('answer-result', ({ correct, correctIndex }) => {})
    s.on('game-over', ({ leaderboard }) => { setLeaderboard(leaderboard); alert('Game over') })

    return () => s.disconnect()
  }, [code])

  async function loadQuestionsForHost(){
    const res = await axios.get('http://localhost:5000/api/questions/sample')
    setQuestionsBank(res.data.questions)
  }

  function startGame(){
    if(!socket) return
    if(questionsBank.length === 0){ alert('Load questions first'); return }
    socket.emit('start-game', { code, questions: questionsBank }, (res) => {})
  }

  function submitAnswer(i){ if(!socket || !question) return; socket.emit('submit-answer', { code, selectedIndex: i }, ()=>{} ) }
  function nextQuestion(){ if(!socket) return; socket.emit('next-question', { code }, ()=>{} ) }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Room: {code}</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Players</h3>
          <ul className="mt-2">{players.map((p,i)=><li key={i}>{p.name}</li>)}</ul>
          <div className="mt-4">
            <button onClick={loadQuestionsForHost} className="px-3 py-2 bg-indigo-600 text-white rounded mr-2">Load Questions</button>
            <button onClick={startGame} className="px-3 py-2 bg-green-600 text-white rounded">Start Game</button>
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow col-span-2">
          <h3 className="font-semibold">Live</h3>
          {question ? (
            <div>
              <div className="text-sm text-slate-500">Q {index + 1}</div>
              <h2 className="font-semibold">{question.question}</h2>
              <div className="mt-4 grid gap-2">{question.options.map((o,i)=>(<button key={i} onClick={()=>submitAnswer(i)} className="text-left p-3 border rounded">{o}</button>))}</div>
              <div className="mt-4"><button onClick={nextQuestion} className="px-3 py-2 bg-slate-600 text-white rounded">Next</button></div>
            </div>
          ) : (<div>No live question. Wait for host to start.</div>)}
        </div>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold">Leaderboard</h3>
        <ol className="mt-2">{leaderboard.map((p,i)=><li key={i}>{p.name} — {p.score}</li>)}</ol>
      </div>
    </div>
  )
}