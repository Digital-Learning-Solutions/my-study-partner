import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Maths",
    img: "https://source.unsplash.com/800x400/?math,study",
    desc: "Learn concepts of algebra, calculus, and problem solving with interactive lessons.",
  },
  {
    name: "Science",
    img: "https://source.unsplash.com/800x400/?science,lab",
    desc: "Explore physics, chemistry, and biology with practical experiments and real-life examples.",
  },
  {
    name: "Social Science",
    img: "https://source.unsplash.com/800x400/?history,geography",
    desc: "Understand history, geography, and civics with engaging and simplified lessons.",
  },
];

export default function WhatWeProvide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mt-16 px-6"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">What We Provide</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            to={`category/${cat.name.toLowerCase()}`}
            state={cat} // pass data to new page
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center text-lg font-medium hover:scale-105 transition block"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
