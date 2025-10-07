import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

function ThemeToggler() {
  // Correct initial theme function
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light"; // SSR safe
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 bg-gray-300 dark:bg-gray-700"
    >
      <Sun className="absolute left-1 text-yellow-500" size={14} />
      <Moon className="absolute right-1 text-gray-400" size={14} />
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
          theme === "dark" ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default ThemeToggler;
