// src/components/Layout.jsx

import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import reactLogo from '../assets/react.svg'; // Ensure path is correct

const StyledNavLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-slate-700 text-white' // Style for active link on dark background
          : 'text-slate-300 hover:bg-slate-800 hover:text-white' // Style for inactive link
      }`
    }
  >
    {children}
  </NavLink>
);

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // UPDATED: Changed background to be dark and semi-transparent
    <header className="bg-slate-900/70 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={reactLogo} alt="Logo" className="h-9" />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <StyledNavLink to="/courses">Courses</StyledNavLink>
                <StyledNavLink to="/quiz">Quiz</StyledNavLink>
                <StyledNavLink to="/discussions">Discussions</StyledNavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Link
              to="/login"
              className="bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-400 transition-colors"
            >
              Sign In
            </Link>
          </div>
          {/* Mobile Menu Button - styling updated for dark theme */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu - styling updated for dark theme */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-slate-900/95`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <StyledNavLink to="/courses">Courses</StyledNavLink>
          <StyledNavLink to="/quiz">Quiz</StyledNavLink>
          <StyledNavLink to="/discussions">Discussions</StyledNavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-slate-700">
          <div className="px-2">
             <Link
              to="/login"
              className="w-full block text-center bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  // Footer can remain the same as it's already dark
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">&copy; {new Date().getFullYear()} AI Learning Platform. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;