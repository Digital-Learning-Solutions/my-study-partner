import React, { useState, useEffect } from "react";
import { Outlet, Link, NavLink, Routes, Route } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import Quiz from "./Quiz";
import Discussion from "./pages/Discussions/Discussion";
import Cource from "./Course";
import ThemeToggler from "./components/ThemeToggler";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", toggleMenu);
    }

    return () => {
      if (mobileMenuButton) {
        mobileMenuButton.removeEventListener("click", toggleMenu);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen dark">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                className="h-10 w-auto"
                src="https://placehold.co/150x50/3b82f6/ffffff?text=YourLogo"
                alt="Your Company Logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Courses
            </NavLink>
            <NavLink
              to="/quiz"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Quizzes
            </NavLink>
            <NavLink
              to="/discussions"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Discussions
            </NavLink>
            <ThemeToggler />
            <Link
              to="/login"
              className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              id="mobile-menu-button"
              className="text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div id="mobile-menu" className={isMenuOpen ? "block" : "hidden"}>
          <Link
            to="/"
            className="block py-2 px-6 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="block py-2 px-6 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Courses
          </Link>
          <Link
            to="/quiz"
            className="block py-2 px-6 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Quiz
          </Link>
          <Link
            to="/discussions"
            className="block py-2 px-6 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Discussions
          </Link>
          <ThemeToggler />
          <Link
            to="login"
            className="block py-2 px-6 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Login
          </Link>
          <Link
            to="register"
            className="block py-2 px-6 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-grow bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="/quiz/*" element={<Quiz />} />
          <Route path="/courses/*" element={<Cource />} />
          <Route path="/discussion/*" element={<Discussion />} />
        </Routes>
      </main>

      <footer className="bg-slate-800 dark:bg-slate-950 text-slate-300 dark:text-slate-400">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} AI Learning Partner. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
