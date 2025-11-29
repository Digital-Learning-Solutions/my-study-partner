/* eslint-disable no-unused-vars */
// src/pages/HomePage.jsx
import React, { useRef, useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
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
import CourseCard from "./components/CourseCard";
import CourseSkeleton from "./components/CourseSkeleton";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Home page (updated & corrected)
 *
 * Notes:
 * - Uses class-based dark mode (tailwind.config.js: darkMode: "class")
 * - Hero image uses the local uploaded test path for quick dev testing:
 *     /mnt/data/A_digital_illustration_showcases_AI-powered_educat.png
 *   For production move the file into `public/images` or `src/assets` and update the path/import.
 */

export default function Home() {
  const snapRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // courseList: null = loading, [] = loaded but empty, [..] = loaded data
  const [courseList, setCourseList] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCourses() {
      try {
        // You can change to a relative path or use an env var for production
        const response = await fetch(`${BACKEND_URL}/api/course/all`, {
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

        // sort by enrollCount safely
        const topEight = [...coursesArray]
          .sort((a, b) => (b.enrollCount || 0) - (a.enrollCount || 0))
          .slice(0, 8);

        if (mounted) setCourseList(topEight);
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

  // keyboard arrow support for focused carousel
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
                {/* LIGHT overlay (visible when NOT .dark) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-3xl blur-3xl opacity-30 block dark:hidden"
                  style={{
                    background:
                      "radial-gradient(800px 400px at 10% 20%, rgba(255,255,255,0.06), transparent 20%), radial-gradient(600px 300px at 90% 80%, rgba(255,255,255,0.04), transparent 30%)",
                    mixBlendMode: "overlay",
                  }}
                />

                {/* DARK overlay (visible when .dark present) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-3xl blur-3xl opacity-25 hidden dark:block"
                  style={{
                    background:
                      "radial-gradient(800px 400px at 10% 20%, rgba(3,7,18,0.55), transparent 20%), radial-gradient(600px 300px at 90% 80%, rgba(3,7,18,0.35), transparent 30%)",
                    mixBlendMode: "overlay",
                  }}
                />

                {/* HERO IMAGE */}
                {/* DEV TEST PATH: /mnt/data/A_digital_illustration_showcases_AI-powered_educat.png */}
                {/* For production: move image to /public/images or import from src/assets */}
                <img
                  loading="lazy"
                  src="/src/assets/hero_image.webp"
                  alt="AI Learning illustration"
                  className="w-full rounded-2xl shadow-soft-lg relative z-10"
                  style={{ objectFit: "cover" }}
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
                  className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-soft hover:shadow-soft-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  aria-label="Scroll courses right"
                  className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-soft hover:shadow-soft-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured courses carousel"
                tabIndex={0}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 scrollbar-hide focus:outline-none"
              >
                {courseList === null ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[24%]"
                    >
                      <CourseSkeleton />
                    </div>
                  ))
                ) : courseList.length === 0 ? (
                  <p className="text-slate-600 dark:text-slate-400">
                    No courses found.
                  </p>
                ) : (
                  courseList.map((c) => (
                    <div
                      key={c._id || c.id}
                      data-card
                      className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[24%]"
                    >
                      <CourseCard course={c} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-brand-600/10 dark:bg-brand-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 dark:bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                Tired of the{" "}
                <span className="text-brand-600 dark:text-brand-400">
                  “One-Size-Fits-All”
                </span>{" "}
                Approach?
              </h2>

              <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional education often fails to accommodate diverse
                learning styles and speeds. This leads to gaps in understanding,
                decreased motivation, low engagement, and unnecessary academic
                pressure.
              </p>

              <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400">
                Every student is different — your learning experience should be
                too.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-slate-50 dark:bg-slate-900 py-20 md:py-28">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-200">
                Your Personalized Path to Success
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
                Our platform provides the tools you need to learn effectively
                and at your own pace.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "Real-time AI Support",
                  desc: "Instant help via intelligent chat and voice assistance.",
                },
                {
                  icon: Zap,
                  title: "Adaptive Quizzes",
                  desc: "Quizzes that adjust to your skill level in real-time.",
                },
                {
                  icon: BookOpen,
                  title: "Personalized Content",
                  desc: "Study plans and resources tailored specifically to you.",
                },
                {
                  icon: BarChart2,
                  title: "Progress Tracking",
                  desc: "Track your learning with clear insights and analytics.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="glass rounded-2xl p-6 text-center shadow-soft-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-600/20 to-accent/30 dark:from-brand-400/20 dark:to-accent/20">
                    <item.icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                  </div>

                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TECHNOLOGY SECTION */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div aria-hidden="true">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 dark:bg-brand-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-10 w-72 h-72 bg-accent/10 dark:bg-accent/10 rounded-full blur-3xl"></div>
          </div>

          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                Powered by Cutting-Edge AI
              </h2>

              <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                We use advanced AI models and modern web technologies to deliver
                a seamless, intelligent, and human-like learning experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-10 mt-14"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-brand-600/20 to-accent/30 dark:from-brand-400/20 dark:to-accent/20 shadow-lg backdrop-blur-md">
                  <Cpu className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="mt-3 text-slate-600 dark:text-slate-400 font-medium">
                  AI Models
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-accent/25 to-brand-600/20 dark:from-accent/10 dark:to-brand-400/20 shadow-lg backdrop-blur-md">
                  <Layers className="w-10 h-10 text-accent dark:text-accent" />
                </div>
                <p className="mt-3 text-slate-600 dark:text-slate-400 font-medium">
                  Neural Layers
                </p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-300">
                  GPT-Style Models
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SPONSORS SECTION */}
        <section
          className="py-12 bg-slate-50 dark:bg-slate-900 overflow-hidden"
          aria-label="Sponsors"
        >
          <div className="section-container relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Our Partners
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Trusted by institutions & companies
              </p>
            </div>

            <div className="relative">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-16 z-20 hidden md:block"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-16 z-20 hidden md:block"
                aria-hidden="true"
              />

              <div
                className="hidden md:block"
                role="group"
                aria-label="Sponsor logos carousel"
              >
                <div className="marquee animate-marquee will-change-transform">
                  <div className="marquee__track flex items-center gap-12">
                    {[
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                    ].map((s, idx) => (
                      <div key={idx} className="flex-shrink-0">
                        <img
                          src={`https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+${s}`}
                          alt={`Sponsor ${s}`}
                          loading="lazy"
                          width="200"
                          height="100"
                          className="h-10 object-contain grayscale opacity-80 dark:opacity-60"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sr-only" aria-hidden="false">
                  Hover or focus the carousel to pause the animation.
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 md:hidden">
                {["A", "B", "C", "D", "E", "F"].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-center">
                    <img
                      src={`https://placehold.co/160x80/e2e8f0/a0aec0?text=Sponsor+${s}`}
                      alt={`Sponsor ${s}`}
                      loading="lazy"
                      className="h-10 object-contain grayscale opacity-80 dark:opacity-60"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="gradient-hero" aria-label="Call to action">
          <div className="section-container py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  Ready to revolutionize your learning?
                </h2>

                <p className="mt-4 text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
                  Join thousands of learners using AI-driven study plans,
                  adaptive quizzes, and 1:1 AI assistance. Start small — learn
                  faster — build momentum.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Link to="/register" aria-label="Get started for free">
                    <Button className="px-6 py-3 rounded-full font-semibold shadow-2xl transform-gpu hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-white/30">
                      Get Started — Free
                    </Button>
                  </Link>

                  <Link to="/subscriptions" aria-label="See subscription plans">
                    <Button
                      variant="outline"
                      className="px-5 py-3 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/15 focus-visible:ring-4 focus-visible:ring-white/20"
                    >
                      View Plans
                    </Button>
                  </Link>
                </div>

                <p className="mt-4 text-sm text-white/80">
                  No credit card required • Cancel anytime • Student pricing
                  available
                </p>
              </motion.div>

              <div
                aria-hidden="true"
                className="pointer-events-none mt-8"
                style={{ display: "flex", justifyContent: "center", gap: 12 }}
              >
                <span className="inline-block w-3 h-3 rounded-full bg-white/20 dark:bg-white/10" />
                <span className="inline-block w-3 h-3 rounded-full bg-white/15 dark:bg-white/8" />
                <span className="inline-block w-3 h-3 rounded-full bg-white/10 dark:bg-white/6" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
