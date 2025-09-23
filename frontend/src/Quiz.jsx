import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Quiz/Home";
import Solo from "./pages/Quiz/Solo";
import Lobby from "./pages/Quiz/Lobby";
import Game from "./pages/Quiz/Game";
import ThemeToggler from "./components/ThemeToggler";

function Quiz() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="p-4 bg-white shadow dark:bg-gray-800 dark:shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="."
            className="font-bold text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Quiz App
          </Link>
          <div className="space-x-4">
            <Link
              to="solo"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Solo
            </Link>
            <Link
              to="multiplayer"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Multiplayer
            </Link>
          </div>
          <ThemeToggler />
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route index element={<Home />} />
          <Route path="solo" element={<Solo />} />
          <Route path="multiplayer" element={<Lobby />} />
          <Route path="game/:code" element={<Game />} />
        </Routes>
      </main>
    </div>
  );
}

export default Quiz;
