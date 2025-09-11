import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // install with: npm install lucide-react

function ThemeToggler() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300
      bg-gray-300 dark:bg-gray-700"
    >
      {/* Sun Icon (left side) */}
      <Sun className="absolute left-1 text-yellow-500" size={14} />

      {/* Moon Icon (right side) */}
      <Moon className="absolute right-1 text-gray-500" size={14} />

      {/* Knob */}
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300
        ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

export default ThemeToggler;
