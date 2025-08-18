// src/App.jsx

import React from 'react';
// Note: 'BrowserRouter as Router' has been removed from this import
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Loginpage';
import RegistrationPage from './pages/Registrationpage';

function App() {
  // The <Router> wrapper has been removed from this return statement
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegistrationPage />} />
      </Route>
    </Routes>
  );
}

export default App;