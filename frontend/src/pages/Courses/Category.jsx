/* eslint-disable no-unused-vars */
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CourseCard from "../../components/CourseCard";

export default function Subjects() {
  const location = useLocation();
  const category = location.state;
  const { subject } = useParams();

  // Example: courses filtered by category

  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(
          `http://localhost:5000/course/${subject}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourseList(data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, [subject]);
  return (
    <div className="px-6 py-10">
      {/* Category Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-4">
          {category.name}
        </h1>
        <img
          src={category.img}
          alt={category.name}
          className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg mb-6"
        />
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {category.desc}
        </p>
      </motion.div>

      {/* Courses Grid */}
      <h2 className="text-2xl font-semibold text-center mb-6">
        {category.name} Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {courseList.map((c, i) => (
          <Link key={i} to={`${c.id}`}>
            <CourseCard course={c} />
          </Link>
        ))}
      </div>
    </div>
  );
}
