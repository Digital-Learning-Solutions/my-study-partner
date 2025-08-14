import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

export default function Lobby(){
  const [name, setName] = useState('Host')
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  function createRoom(){
    const socket = io(SOCKET_URL)
    socket.emit('create-room', { name }, ({ success, code }) => {
      if(success) {
        sessionStorage.setItem('socketId', socket.id)
        sessionStorage.setItem('roomCode', code)
        sessionStorage.setItem('playerName', name)
        navigate(`/game/${code}`)
      } else alert('Create failed')
    })
  }

  function joinRoom(){
    const socket = io(SOCKET_URL)
    socket.emit('join-room', { code, name }, (res) => {
      if(res.success){
        sessionStorage.setItem('socketId', socket.id)
        sessionStorage.setItem('roomCode', code)
        sessionStorage.setItem('playerName', name)
        navigate(`/game/${code}`)
      } else {
        alert(res.message || 'Could not join room')
      }
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Create Room</h2>
        <input value={name} onChange={e=>setName(e.target.value)} className="border p-2 mt-4 w-full" />
        <button onClick={createRoom} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
      </div>
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Join Room</h2>
        <input value={name} onChange={e=>setName(e.target.value)} className="border p-2 mt-4 w-full" placeholder="Your name" />
        <input value={code} onChange={e=>setCode(e.target.value)} className="border p-2 mt-4 w-full" placeholder="Room code" />
        <button onClick={joinRoom} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Join</button>
      </div>
    </div>
  )
}