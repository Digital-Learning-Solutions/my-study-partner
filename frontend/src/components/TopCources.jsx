/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function TopCourses() {
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/course/all`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();

        const coursesArray = Array.isArray(data.courses) ? data.courses : [];

        const topEight = [...coursesArray]
          .sort((a, b) => b.enrollCount - a.enrollCount)
          .slice(0, 8);

        setCourseList(topEight);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mt-20 px-6 py-10"
    >
      <h2 className="text-3xl font-bold text-center mb-10">
        Our Most Popular Courses 🔥
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {courseList.map((c) => (
          <Link key={c._id} to={`${c.courseType}/${c._id}`}>
            <CourseCard course={c} />
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-colors shadow-lg"
        >
          Explore by Search
        </button>
      </div>
    </motion.div>
  );
}
