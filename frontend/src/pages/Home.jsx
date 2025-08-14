import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome — Solo or with friends</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Play Solo</h2>
          <p className="mt-2 text-sm">Generate a quick quiz from interests or upload notes.</p>
          <Link to="/solo" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Play Solo</Link>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Play with Friends</h2>
          <p className="mt-2 text-sm">Create a private room and invite friends with a code.</p>
          <Link to="/multiplayer" className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded">Create / Join</Link>
        </div>
      </div>
    </div>
  )
}