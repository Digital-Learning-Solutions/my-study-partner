import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Simple Card components inline
function Card({ children, className }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}
function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default function Subjects() {
  const location = useLocation();
  const category = location.state;

  // Example: courses filtered by category
  const allCourses = {
    maths: [
      { title: "Algebra Basics", rating: 4.6, enroll: 500, modules: 8, img: "https://source.unsplash.com/400x250/?algebra" },
      { title: "Calculus I", rating: 4.8, enroll: 400, modules: 12, img: "https://source.unsplash.com/400x250/?calculus" },
    ],
    science: [
      { title: "Physics Fundamentals", rating: 4.7, enroll: 600, modules: 10, img: "https://source.unsplash.com/400x250/?physics" },
      { title: "Biology 101", rating: 4.5, enroll: 450, modules: 9, img: "https://source.unsplash.com/400x250/?biology" },
    ],
    "social science": [
      { title: "World History", rating: 4.4, enroll: 300, modules: 7, img: "https://source.unsplash.com/400x250/?history" },
      { title: "Geography Basics", rating: 4.6, enroll: 350, modules: 8, img: "https://source.unsplash.com/400x250/?geography" },
    ],
  };

  const courses = allCourses[category.name.toLowerCase()] || [];

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
        <p className="text-lg text-gray-700 dark:text-gray-300">{category.desc}</p>
      </motion.div>

      {/* Courses Grid */}
      <h2 className="text-2xl font-semibold text-center mb-6">
        {category.name} Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {courses.map((c, i) => (
          <Card
            key={i}
            className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <img src={c.img} alt={c.title} className="w-full h-40 object-cover" />
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
              <div className="flex items-center text-sm text-yellow-500 mb-2">
                <Star size={16} fill="gold" className="mr-1" /> {c.rating}
              </div>
              <p className="text-sm">Enrolled: {c.enroll}</p>
              <p className="text-sm">Modules: {c.modules}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
