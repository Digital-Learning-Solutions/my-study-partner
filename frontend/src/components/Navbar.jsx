import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/quiz", label: "Quizzes" },
    { to: "/discussions", label: "Discussions" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://placehold.co/150x50/3b82f6/ffffff?text=YourLogo"
            alt="Logo"
            className="h-10 w-auto rounded"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
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
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggler />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-700 dark:text-slate-300 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-inner">
          <div className="flex flex-col space-y-3 px-6 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-slate-700 dark:text-slate-300 py-1 hover:text-blue-600 dark:hover:text-blue-400 transition ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="block bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
