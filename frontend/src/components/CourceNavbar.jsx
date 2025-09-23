import { Link } from "react-router-dom";
import ThemeToggler from "./ThemeToggler"; // if you already have a theme toggler component

export default function CoursesNavbar() {
  return (
    <nav className="p-4 bg-white shadow dark:bg-gray-800 dark:shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <Link
          to="/"
          className="font-bold text-gray-800 dark:text-gray-100 hover:text-sky-600 dark:hover:text-sky-400 transition"
        >
          Courses App
        </Link>

        {/* Menu Links */}
        <div className="space-x-4">
          <Link
            to="/"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            Courses
          </Link>
          <Link
            to="/about"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            Contact
          </Link>
        </div>

        {/* Dark/Light Theme Toggle */}
        <ThemeToggler />
      </div>
    </nav>
  );
}
