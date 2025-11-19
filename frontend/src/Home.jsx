/* src/pages/HomePage.jsx */
import React, { useRef, useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Zap, BarChart2, MessageSquare, Cpu, Layers } from "react-feather";
import Button from "./components/ui/Button";
import FeatureCard from "./components/ui/FeatureCard";
import CourseCard from "./components/CourseCard";
import CourseSkeleton from "./components/CourseSkeleton";

export default function Home() {
  const snapRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // courseList: null = loading, [] = loaded but empty, [..] = loaded data
  const [courseList, setCourseList] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCourses() {
      try {
        const response = await fetch("http://localhost:5000/api/course/all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          console.error("Failed to fetch courses, status:", response.status);
          if (mounted) setCourseList([]);
          return;
        }

        const data = await response.json();
        const coursesArray = Array.isArray(data.courses) ? data.courses : [];

        console.log("Fetched courses:", coursesArray);

        const topEight = [...coursesArray]
          .sort((a, b) => (b.enrollCount || 0) - (a.enrollCount || 0))
          .slice(0, 8);

        if (mounted) setCourseList(topEight);
        console.log("Top 8:", topEight);

      } catch (error) {
        console.error("Error fetching courses:", error);
        if (mounted) setCourseList([]);
      }
    }

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  const scrollByCards = useCallback((dir) => {
    const el = snapRef.current;
    if (!el) return;
    const child = el.querySelector("[data-card]");
    const gap = 16;
    const delta = child ? child.clientWidth + gap : 320;
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = snapRef.current;
    if (!el) return;

    const handler = (e) => {
      const active = document.activeElement;
      if (!el.contains(active) && active !== el) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByCards(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByCards(1);
      }
    };

    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [scrollByCards]);

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <main>

        {/* HERO */}
        <section className="gradient-hero" aria-label="Hero">
          <div className="section-container py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative">
              
              {/* LEFT */}
              <motion.div {...motionProps}>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-white">
                  Your AI-Powered Learning Partner
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-xl">
                  Personalized courses, adaptive quizzes, and real-time AI help.
                  Learn faster, retain more, and track your progress.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <Link to="/register">
                    <Button className="shadow-soft-lg focus-visible:ring-4 focus-visible:ring-white/30">
                      Get Started — Free
                    </Button>
                  </Link>

                  <Link to="/quiz">
                    <Button
                      variant="outline"
                      className="bg-white/10 text-white border-white/30 hover:bg-white/15 focus-visible:ring-4 focus-visible:ring-white/20"
                    >
                      Try a Quiz
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* RIGHT */}
              <motion.div
                {...(prefersReducedMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 18 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.6, delay: 0.1 },
                    })}
                className="relative"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-3xl blur-3xl opacity-30 dark:opacity-20"
                  style={{
                    background:
                      "radial-gradient(800px 400px at 10% 20%, rgba(255,255,255,0.06), transparent 20%), radial-gradient(600px 300px at 90% 80%, rgba(255,255,255,0.04), transparent 30%)",
                    mixBlendMode: "overlay",
                  }}
                />

                <img
                  loading="lazy"
                  src="https://placehold.co/800x600/ffffff/111?text=AI+Learning"
                  alt="AI Learning illustration"
                  className="w-full rounded-2xl shadow-soft-lg relative z-10"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* COURSE CAROUSEL */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
                Explore Our Courses
              </h2>

              <div className="flex space-x-2">
                <button
                  onClick={() => scrollByCards(-1)}
                  aria-label="Scroll courses left"
                  className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-soft
                  hover:shadow-soft-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition 
                  text-slate-600 dark:text-slate-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                <button
                  onClick={() => scrollByCards(1)}
                  aria-label="Scroll courses right"
                  className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-soft
                  hover:shadow-soft-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition 
                  text-slate-600 dark:text-slate-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                ref={snapRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured courses carousel"
                tabIndex={0}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 scrollbar-hide focus:outline-none"
              >
                {courseList === null ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[24%]">
                      <CourseSkeleton />
                    </div>
                  ))
                ) : courseList.length === 0 ? (
                  <p className="text-slate-600 dark:text-slate-400">No courses found.</p>
                ) : (
                  courseList.map((c) => (
                    <div key={c._id || c.id} data-card className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[24%]">
                      <CourseCard course={c} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

        {/* FEATURES */}
        <section className="bg-slate-50 dark:bg-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* TECHNOLOGY */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Powered by Cutting-Edge AI
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              We use advanced AI models and modern web technologies to deliver a seamless, intelligent, and human-like learning experience.
            </p>
            <div className="flex justify-center items-center space-x-8">
              <Cpu className="w-16 h-16 text-slate-500 dark:text-slate-400" />
              <Layers className="w-16 h-16 text-slate-500 dark:text-slate-400" />
              <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">GPT-style models</span>
            </div>
          </div>
        </section>

        {/* SPONSORS */}
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
                      loading="lazy"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Revolutionize Your Learning?</h2>
            <div className="mt-8">
              <Link to="/register">
                <Button className="shadow-soft-lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
