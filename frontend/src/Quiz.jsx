import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Solo from './pages/Solo'
import Lobby from './pages/Lobby'
import Game from './pages/Game'

function Quiz(){
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-4 bg-white shadow">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold">Quiz App</Link>
          <div className="space-x-4">
            <Link to="/solo" className="text-sm">Solo</Link>
            <Link to="/multiplayer" className="text-sm">Multiplayer</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/solo" element={<Solo/>} />
          <Route path="/multiplayer" element={<Lobby/>} />
          <Route path="/game/:code" element={<Game/>} />
        </Routes>
      </main>
    </div>
  )
}

export default Quiz