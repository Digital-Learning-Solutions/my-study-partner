import { Routes, Route, Link } from "react-router-dom";

import ThemeToggler from "./components/ThemeToggler";
import QuizHubPage from "./QuizHub";
import SoloPage from "./pages/Quiz/SoloPage";
import LobbyPage from "./pages/Quiz/LobbyPage";
import GamePage from "./pages/Quiz/GamePage";
import { useStoredContext } from "./context/useStoredContext";

function Quiz() {
  const { user } = useStoredContext();

  console.log("Quiz User:", user);
  return (
    // <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    //    <nav className="p-4 bg-white shadow dark:bg-gray-800 dark:shadow-lg">
    //     <div className="container mx-auto flex justify-between items-center">
    //       <Link
    //         to="."
    //         className="font-bold text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
    //       >
    //         Quiz App
    //       </Link>
    //       <div className="space-x-4">
    //         <Link
    //           to="/"
    //           className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
    //         >
    //           Home
    //         </Link>
    //         <Link
    //           to="solo"
    //           className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
    //         >
    //           Solo
    //         </Link>
    //         <Link
    //           to="multiplayer"
    //           className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
    //         >
    //           Multiplayer
    //         </Link>
    //       </div>
    //       <ThemeToggler />
    //     </div>
    //   </nav>

    <main className="flex-1 container mx-auto p-4">
      <Routes>
        <Route index element={<QuizHubPage />} />
        <Route path="solo" element={<SoloPage />} />
        <Route path="multiplayer" element={<LobbyPage />} />
        <Route path="game/:code" element={<GamePage />} />
      </Routes>
    </main>
    // </div>
  );
}

export default Quiz;
