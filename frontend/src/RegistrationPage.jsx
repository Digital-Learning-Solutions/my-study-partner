import { LogOutIcon } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoIcon from "./assets/logo.png";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function RegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden md:grid md:grid-cols-2 border border-gray-200 dark:border-gray-700 transition-colors">
          {/* Left side branding */}
          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-indigo-900 text-white">
            <img src={logoIcon} alt="Logo" className="h-16 mb-6 rounded-lg" />
            <h1 className="text-3xl font-bold text-center mb-3">
              Join Us Today
            </h1>
            <p className="text-center text-blue-200 dark:text-blue-300">
              Create an account to get started with your AI-powered learning
              partner.
            </p>
          </div>

          {/* Right side form */}
          <div className="p-8 md:p-12">
            <h2 className="mt-6 text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
              Create a new account
            </h2>

            {error && (
              <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <input
                  name="fullName"
                  type="text"
                  required
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full Name"
                />
                <input
                  name="username"
                  type="text"
                  required
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Username"
                />
                <input
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email address"
                />
                <input
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
