import About from "../../components/About";
import CoursesNavbar from "../../components/CourceNavbar";
import Hero from "../../components/Hero";
import OngoingCourses from "../../components/OngoingCourses";
import TopCourses from "../../components/TopCources";
import WhatWeProvide from "../../components/WhatWeProvide";
import { useStoredContext } from "../../context/useStoredContext";

export default function CourseLanding() {
  const { user } = useStoredContext();

  return (
    <div
      className="
  min-h-screen 
  bg-gradient-to-br 
  from-blue-50 via-indigo-50 to-purple-50
  dark:bg-gradient-to-br 
  dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
  relative overflow-hidden
"
    >
      {/* Dark mode glowing effects */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-400 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300 opacity-10 blur-[110px] rounded-full"></div>
      </div>

      {/* ✨ Main Content */}
      <div className="relative z-10">
        {/* HERO */}
        <Hero />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ongoing Courses */}
          {user && (
            <OngoingCourses enrolledCourses={user.enrolledCourses || []} />
          )}

          {/* Top Courses */}
          <TopCourses />

          {/* What We Provide */}
          <WhatWeProvide />

          {/* About */}
          <About />
        </main>
      </div>
    </div>
  );
}
