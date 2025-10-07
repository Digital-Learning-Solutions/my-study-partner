/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";

// Simple Card components (inline)

export default function TopCourses() {
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("http://localhost:5000/course/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
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
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mt-16 px-6"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Top Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {courseList.map((c, i) => (
          <Link key={i} to={`${c.courceType}/${c.id}`}>
            <CourseCard course={c} />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
