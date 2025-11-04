// src/pages/HomePage.jsx

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Zap,
  BarChart2,
  MessageSquare,
  Cpu,
  Layers,
} from "react-feather";
import Button from "./components/ui/Button";
import FeatureCard from "./components/ui/FeatureCard";

function Home() {
  const snapRef = useRef(null);
  const scrollByCards = (dir) => {
    const el = snapRef.current;
    if (!el) return;
    const child = el.querySelector("[data-card]");
    const delta = child ? child.clientWidth + 16 : 320; // 16px gap
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Hero Section */}
      <section className="gradient-hero">
        <div className="section-container py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Your AI-Powered Learning Partner
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                Personalized courses, adaptive quizzes, and real-time AI help. Learn faster, retain more, and track your progress.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link to="/register">
                  <Button className="shadow-soft-lg">Get Started — Free</Button>
                </Link>
                <Link to="/quiz">
                  <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/15">
                    Try a Quiz
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <img loading="lazy" src="https://placehold.co/800x600/ffffff/111?text=AI+Learning" alt="AI Learning" className="w-full rounded-2xl shadow-soft-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Carousel */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
              Explore Our Courses
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => scrollByCards(-1)}
                className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-soft hover:shadow-soft-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <button
                onClick={() => scrollByCards(1)}
                className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-soft hover:shadow-soft-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              ref={snapRef}
              className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <article key={i} data-card className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[30%]">
                  <div className="rounded-2xl border border-border dark:border-white/10 bg-white dark:bg-slate-900 shadow-soft hover:shadow-soft-lg transition-all duration-200 overflow-hidden">
                    <img
                      loading="lazy"
                      src={`https://placehold.co/800x450/${i * 111111}/ffffff?text=Course+${i}`}
                      alt={`Course ${i}`}
                      className="w-full aspect-[16/9] object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg">Course {i} Title</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Instructor {i}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold">₹{500 + i * 50}</span>
                        <Button className="px-3 py-1.5 text-xs">Enroll</Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 md:py-24">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Tired of the "One-Size-Fits-All" Approach?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Traditional education often fails to accommodate diverse learning
            styles and speeds. This leads to gaps in understanding, low
            engagement, and unnecessary academic pressure.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16 md:py-24">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
              Your Personalized Path to Success
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
              Our platform provides the tools you need to learn effectively and
              at your own pace.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={MessageSquare} title="Real-time AI Support" description="Instant help via intelligent chat and voice interface." />
            <FeatureCard icon={Zap} title="Adaptive Quizzes" description="Quizzes that adjust to your personal skill level." />
            <FeatureCard icon={BookOpen} title="Personalized Content" description="Study materials and recommendations tailored to you." />
            <FeatureCard icon={BarChart2} title="Progress Tracking" description="Visualize your learning with clear dashboards." />
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 md:py-24">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Powered by Cutting-Edge AI
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            We use advanced AI models and modern web technologies to deliver a
            seamless, intelligent, and human-like learning experience.
          </p>
          <div className="flex justify-center items-center space-x-8">
            <Cpu className="w-16 h-16 text-slate-500 dark:text-slate-400" />
            <Layers className="w-16 h-16 text-slate-500 dark:text-slate-400" />
            <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">GPT-style models</span>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="bg-slate-50 dark:bg-slate-900 py-12">
        <div className="w-full overflow-hidden">
          <div className="flex animate-marquee">
            <div className="flex w-max items-center">
              {["A", "B", "C", "D", "E", "F", "A", "B", "C", "D", "E", "F"].map(
                (s, idx) => (
                  <img
                    key={idx}
                    src={`https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+${s}`}
                    alt={`Sponsor ${s}`}
                    className="mx-8 h-10 grayscale opacity-80 dark:opacity-60"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gradient-hero">
        <div className="section-container py-16 md:py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Revolutionize Your Learning?
          </h2>
          <div className="mt-8">
            <Link to="/register">
              <Button className="shadow-soft-lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
