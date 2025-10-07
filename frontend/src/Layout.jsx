import React, { useState, useEffect } from "react";
import { Outlet, Link, NavLink, Routes, Route } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import Quiz from "./Quiz";
import Discussion from "./pages/Discussions/Discussion";
import Cource from "./Course";
import ThemeToggler from "./components/ThemeToggler";
import Navbar from "./components/Navbar";

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
    <div className="flex flex-col min-h-screen">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <Navbar />

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
