import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStoredContext } from "./context/useStoredContext";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStoredContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save JWT & user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      setUser(data.user);
      // ✅ Redirect after login
      navigate("/"); // change this to your actual home page route
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden md:grid md:grid-cols-2 transition-colors duration-300">
          {/* Branding Panel (Left Side) */}
          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white dark:from-blue-700 dark:to-blue-900 transition-colors duration-300">
            <img
              src="https://placehold.co/150x60/ffffff/3b82f6?text=YourLogo"
              alt="Logo"
              className="h-16 mb-6 rounded-lg"
            />
            <h1 className="text-3xl font-bold text-center mb-3">
              Welcome Back
            </h1>
            <p className="text-center text-blue-200">
              Sign in to continue your personalized learning journey.
            </p>
          </div>

          {/* Form Panel (Right Side) */}
          <div className="p-8 md:p-12">
            <h2 className="mt-6 text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
              Sign in to your account
            </h2>

            {error && (
              <p className="text-red-500 text-center mt-3 text-sm">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 dark:bg-slate-700 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 dark:bg-slate-700 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-center text-slate-600 dark:text-slate-400">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
