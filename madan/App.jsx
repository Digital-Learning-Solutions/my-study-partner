// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import main layout component
import Layout from './components/Layout'; 

// Import main pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

// CORRECTED: Import all quiz-related pages from their actual location in the '/pages/quiz' subfolder
import QuizHubPage from './pages/quiz/QuizHubPage';
import SoloPage from './pages/quiz/SoloPage';
import LobbyPage from './pages/quiz/LobbyPage';
import GamePage from './pages/quiz/GamePage';

// Note: The 'Quiz.jsx' file in the root of 'src' is no longer needed for routing.

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Main Site Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegistrationPage />} />

        {/* Quiz Application Routes */}
        {/* The "/quiz" path now correctly points to the QuizHubPage */}
        <Route path="quiz" element={<QuizHubPage />} />
        
        {/* Sub-routes for the different quiz modes */}
        <Route path="quiz/solo" element={<SoloPage />} />
        <Route path="quiz/multiplayer" element={<LobbyPage />} />
        
        {/* Dynamic route for an active game room */}
        <Route path="quiz/game/:code" element={<GamePage />} />
      </Route>
    </Routes>
  );
}

export default App;
