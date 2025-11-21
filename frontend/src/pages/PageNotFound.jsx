// src/pages/PageNotFound.jsx
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-6
        bg-gradient-to-br from-slate-100 to-slate-200
        dark:from-slate-900 dark:to-slate-950
        transition-colors duration-300
      "
    >
      <div
        className="
          max-w-lg w-full p-10 rounded-2xl text-center
          bg-white/70 dark:bg-slate-800/40
          backdrop-blur-xl border border-white/10 dark:border-slate-700
          shadow-2xl
        "
      >
        {/* 404 Number */}
        <h1 className="text-5xl font-extrabold text-slate-800 dark:text-white">
          404
        </h1>

        {/* Title */}
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mt-1">
          Page Not Found
        </p>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
          The page you're looking for doesn't exist or was moved. Please check
          the link or return to safety.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="
              flex items-center justify-center gap-2 
              px-4 py-2.5 rounded-lg w-full sm:w-auto
              bg-slate-200 hover:bg-slate-300 
              dark:bg-slate-700 dark:hover:bg-slate-600
              text-slate-800 dark:text-slate-100
              transition-all shadow-sm
            "
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <Link
            to="/"
            className="
              flex items-center justify-center gap-2
              px-4 py-2.5 rounded-lg w-full sm:w-auto
              bg-indigo-600 hover:bg-indigo-700 text-white
              transition-all shadow-md
            "
          >
            <Home size={18} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
