// src/pages/HomePage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// Feather Icons are great for simple, professional icons.
// If you haven't already, run: npm install react-feather
import { BookOpen, Zap, BarChart2, MessageSquare, Cpu, Layers } from 'react-feather';

function HomePage() {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  
  const totalCards = 6; // Total number of course cards in the carousel

  // Logic to handle carousel resizing and state
  useEffect(() => {
    const calculateCardWidth = () => {
      if (carouselRef.current) {
        const firstCard = carouselRef.current.querySelector('.flex-shrink-0');
        if (firstCard) {
          setCardWidth(firstCard.offsetWidth);
        }
      }
    };

    const updateCardsToShow = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 768) setCardsToShow(2);
      else if (window.innerWidth < 1024) setCardsToShow(3);
      else setCardsToShow(4);
    };

    calculateCardWidth();
    updateCardsToShow();
    const handleResize = () => {
        calculateCardWidth();
        updateCardsToShow();
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = totalCards - cardsToShow;

  const next = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      const offset = -currentIndex * cardWidth;
      carouselRef.current.style.transform = `translateX(${offset}px)`;
    }
  }, [currentIndex, cardWidth]);

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Your AI-Powered Learning Partner
            </h1>
            <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
                Our platform adapts to your unique learning style, providing customized quizzes, real-time feedback, and a clear path to academic success.
            </p>
            <div className="mt-8">
                <Link to="/register" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-50 transition-transform transform hover:scale-105 inline-block">
                    Get Started for Free
                </Link>
            </div>
        </div>
      </section>

      {/* 2. Multi-Item Course Carousel Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Explore Our Courses</h2>
                <div className="flex space-x-2">
                    <button onClick={prev} disabled={currentIndex === 0} className="bg-white p-3 rounded-full shadow-lg hover:bg-slate-100 transition text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button onClick={next} disabled={currentIndex >= maxIndex} className="bg-white p-3 rounded-full shadow-lg hover:bg-slate-100 transition text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
            <div className="relative overflow-hidden">
                <div ref={carouselRef} className="flex" style={{ transition: 'transform 0.5s ease-in-out' }}>
                    {/* Course Cards */}
                    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full"><a href="#"><img src="https://placehold.co/600x400/3b82f6/ffffff?text=Course+1" alt="Course 1" className="w-full h-40 object-cover" /></a><div className="p-4 flex flex-col flex-grow"><h3 className="font-bold text-lg">ChatGPT Masterclass</h3><p className="text-sm text-slate-500">Henry Habib</p><div className="mt-auto pt-2"><p className="font-bold">₹629</p></div></div></div>
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full"><a href="#"><img src="https://placehold.co/600x400/10b981/ffffff?text=Course+2" alt="Course 2" className="w-full h-40 object-cover" /></a><div className="p-4 flex flex-col flex-grow"><h3 className="font-bold text-lg">ChatGPT & AI Tools</h3><p className="text-sm text-slate-500">Todd McLeod</p><div className="mt-auto pt-2"><p className="font-bold">₹549</p></div></div></div>
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full"><a href="#"><img src="https://placehold.co/600x400/8b5cf6/ffffff?text=Course+3" alt="Course 3" className="w-full h-40 object-cover" /></a><div className="p-4 flex flex-col flex-grow"><h3 className="font-bold text-lg">AI ChatGPT for Business</h3><p className="text-sm text-slate-500">Jun Wu</p><div className="mt-auto pt-2"><p className="font-bold">₹629</p></div></div></div>
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full"><a href="#"><img src="https://placehold.co/600x400/f59e0b/ffffff?text=Course+4" alt="Course 4" className="w-full h-40 object-cover" /></a><div className="p-4 flex flex-col flex-grow"><h3 className="font-bold text-lg">ChatGPT for Programmers</h3><p className="text-sm text-slate-500">Ardit Sulce</p><div className="mt-auto pt-2"><p className="font-bold">₹689</p></div></div></div>
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full"><a href="#"><img src="https://placehold.co/600x400/ef4444/ffffff?text=Course+5" alt="Course 5" className="w-full h-40 object-cover" /></a><div className="p-4 flex flex-col flex-grow"><h3 className="font-bold text-lg">Advanced Python</h3><p className="text-sm text-slate-500">Jane Doe</p><div className="mt-auto pt-2"><p className="font-bold">₹799</p></div></div></div>
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col h-full"><a href="#"><img src="https://placehold.co/600x400/3b82f6/ffffff?text=Course+6" alt="Course 6" className="w-full h-40 object-cover" /></a><div className="p-4 flex flex-col flex-grow"><h3 className="font-bold text-lg">React for Beginners</h3><p className="text-sm text-slate-500">John Smith</p><div className="mt-auto pt-2"><p className="font-bold">₹499</p></div></div></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. The Problem Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Tired of the "One-Size-Fits-All" Approach?
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Traditional education often fails to accommodate diverse learning styles and speeds. This leads to gaps in understanding, low engagement, and unnecessary academic pressure.
          </p>
        </div>
      </section>

      {/* 4. The Solution / Features Section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Your Personalized Path to Success
            </h2>
            <p className="text-lg text-slate-600 mt-2">
              Our platform provides the tools you need to learn effectively and at your own pace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Real-time AI Support</h3>
              <p className="text-slate-600">Get instant help, 24/7, through an intelligent chat and voice interface.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Adaptive Quizzes</h3>
              <p className="text-slate-600">Test your knowledge with quizzes that adjust to your personal skill level.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Personalized Content</h3>
              <p className="text-slate-600">Receive study materials and recommendations tailored just for you.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <BarChart2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Progress Tracking</h3>
              <p className="text-slate-600">Visualize your learning journey with interactive dashboards and maps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works / Technology Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Powered by Cutting-Edge AI
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            We use advanced AI models and modern web technologies to deliver a seamless, intelligent, and human-like learning experience.
          </p>
          <div className="flex justify-center items-center space-x-8">
              <Cpu className="w-16 h-16 text-slate-500" />
              <Layers className="w-16 h-16 text-slate-500" />
              <span className="text-2xl font-bold text-slate-500">GPT-4 & BERT</span>
          </div>
        </div>
      </section>
      
      {/* 6. Sponsors Marquee Section */}
      <section className="bg-slate-50 py-12">
        <div className="w-full overflow-hidden">
            <div className="flex animate-marquee">
                <div className="flex w-max items-center">
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+A" alt="Sponsor A" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+B" alt="Sponsor B" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+C" alt="Sponsor C" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+D" alt="Sponsor D" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+E" alt="Sponsor E" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+F" alt="Sponsor F" className="mx-8 h-10 grayscale opacity-75" />
                    {/* Duplicate set for seamless loop */}
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+A" alt="Sponsor A" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+B" alt="Sponsor B" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+C" alt="Sponsor C" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+D" alt="Sponsor D" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+E" alt="Sponsor E" className="mx-8 h-10 grayscale opacity-75" />
                    <img src="https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+F" alt="Sponsor F" className="mx-8 h-10 grayscale opacity-75" />
                </div>
            </div>
        </div>
      </section>

      {/* 7. Final Call-to-Action Section */}
      <section className="bg-blue-700">
        <div className="container mx-auto px-6 py-16 md:py-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Revolutionize Your Learning?
            </h2>
            <div className="mt-8">
                <Link to="/register" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-50 transition-transform transform hover:scale-105 inline-block">
                    Get Started for Free
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;