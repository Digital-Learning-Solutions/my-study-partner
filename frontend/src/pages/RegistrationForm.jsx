// src/pages/RegistrationPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function RegistrationForm() {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-white">Create an Account</h1>
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Account
        </button>
      </form>
      <p className="text-sm text-center text-gray-400">
        Already have an account? <Link to="/login" className="font-medium text-indigo-400 hover:underline">Login here</Link>
      </p>
    </div>
  );
}

function RegistrationPage() {
  return (
    <div className="flex items-center justify-center py-12" style={{ background: 'linear-gradient(to right, #1e3a8a, #3b82f6)' }}>
      <RegistrationForm />
    </div>
  );
}

export default RegistrationPage;