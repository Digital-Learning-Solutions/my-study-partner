import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold">Welcome — Solo or with friends</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solo Card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-xl font-semibold">Play Solo</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Generate a quick quiz from interests or upload notes.
          </p>
          <Link
            to="solo"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          >
            Play Solo
          </Link>
        </div>

        {/* Multiplayer Card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-xl font-semibold">Play with Friends</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Create a private room and invite friends with a code.
          </p>
          <Link
            to="multiplayer"
            className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Create / Join
          </Link>
        </div>
      </div>
    </div>
  );
}
