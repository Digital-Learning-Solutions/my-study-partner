// src/components/Layout.jsx

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import reactLogo from '../assets/react.svg'; // Make sure this path is correct

function Header() {
  return (
    <header className="sticky top-0 left-0 w-full h-16 bg-white/25 backdrop-blur-[16px] saturate-[180%] border-b border-[#c8c8ff2e] shadow-[0_4px_24px_0_rgba(80,80,180,0.08)] flex items-center justify-between z-[1000] px-8">
      <div className="flex items-center">
        <Link to="/">
          <img src={reactLogo} alt="Logo" className="h-11 mr-4 rounded-xl shadow-[0_2px_8px_rgba(100,108,255,0.10)]" />
        </Link>
      </div>
      <div className="flex gap-6">
        <button className="bg-white/35 border border-[#646cff22] text-base text-[#2a2a44] font-medium cursor-pointer py-2 px-6 rounded-lg transition hover:bg-[#646cff1a] hover:shadow-[0_2px_8px_rgba(100,108,255,0.13)] mx-0.5">Courses</button>
        <button className="bg-white/35 border border-[#646cff22] text-base text-[#2a2a44] font-medium cursor-pointer py-2 px-6 rounded-lg transition hover:bg-[#646cff1a] hover:shadow-[0_2px_8px_rgba(100,108,255,0.13)] mx-0.5">Quiz</button>
        <button className="bg-white/35 border border-[#646cff22] text-base text-[#2a2a44] font-medium cursor-pointer py-2 px-6 rounded-lg transition hover:bg-[#646cff1a] hover:shadow-[0_2px_8px_rgba(100,108,255,0.13)] mx-0.5">Discussions</button>
      </div>
      <div>
        <Link to="/login" className="bg-[#646cff] text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-[#4b4be7] transition">
          Sign In
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[#141622fa] text-[#e6e6f0] border-t-2 border-[#646cff22] shadow-[0_-2px_16px_0_rgba(80,80,180,0.08)] relative bottom-0 left-0 z-[100]">
      <div className="flex flex-wrap justify-between items-center max-w-[1200px] mx-auto py-6 px-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[1.2rem] font-bold text-[#646cff] tracking-wider">AI Learning</span>
          <span className="text-[0.95rem] text-[#b0b0c3]">© {new Date().getFullYear()} AI Driven Personalized Student Learning Platform</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-[#e6e6f0] no-underline text-base font-medium hover:text-[#646cff] transition">About</a>
          <a href="#" className="text-[#e6e6f0] no-underline text-base font-medium hover:text-[#646cff] transition">Contact</a>
          <a href="#" className="text-[#e6e6f0] no-underline text-base font-medium hover:text-[#646cff] transition">Careers</a>
        </div>
        <div className="flex gap-3">
          <a href="#" className="text-2xl hover:text-[#646cff] transition">🌐</a>
          <a href="#" className="text-2xl hover:text-[#646cff] transition">🐦</a>
          <a href="#" className="text-2xl hover:text-[#646cff] transition">💼</a>
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