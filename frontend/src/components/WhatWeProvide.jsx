/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import categories from "../utils/Category";

export default function WhatWeProvide() {
  return (
    <motion.div
      // ... motion props
      className="mt-20 px-6 py-10 bg-white dark:bg-gray-800 shadow-inner rounded-xl" // ⭐ Added background/padding for separation
    >
      <h2 className="text-3xl font-bold text-center mb-4">
        Explore Our Categories
      </h2>
      <p className="text-center max-w-2xl mx-auto mb-10 text-gray-600 dark:text-gray-300">
        Find the perfect course by browsing through our expertly curated
        subjects.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            to={`${cat.name.toLowerCase().split(" ").join("-")}`}
            state={cat}
            className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
          >
            {/* Image Placeholder */}
            <div className="h-32 overflow-hidden">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
            </div>

            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 text-sky-600 dark:text-sky-400">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {cat.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
