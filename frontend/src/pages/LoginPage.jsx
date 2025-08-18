// src/pages/LoginPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import reactLogo from '../assets/react.svg'; // Ensure path is correct

function LoginPage() {
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden md:grid md:grid-cols-2">
          
          {/* Branding Panel (Left Side) */}
          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <img src={reactLogo} alt="Logo" className="h-16 mb-6" />
            <h1 className="text-3xl font-bold text-center mb-3">Welcome Back</h1>
            <p className="text-center text-blue-200">
              Sign in to continue your personalized learning journey.
            </p>
          </div>

          {/* Form Panel (Right Side) */}
          <div className="p-8 md:p-12">
            <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
              Sign in to your account
            </h2>
            <form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                </button>
              </div>
            </form>
            <p className="mt-6 text-sm text-center text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
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