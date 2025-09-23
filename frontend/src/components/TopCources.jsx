import { motion } from "framer-motion";
import { Star } from "lucide-react";

// Simple Card components (inline)
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

export default function TopCourses() {
  const courses = [
    {
      title: "React Basics",
      rating: 4.8,
      enroll: 1200,
      modules: 10,
      img: "https://source.unsplash.com/400x250/?react,code",
    },
    {
      title: "Mathematics 101",
      rating: 4.5,
      enroll: 950,
      modules: 15,
      img: "https://source.unsplash.com/400x250/?math,study",
    },
    {
      title: "Science Simplified",
      rating: 4.7,
      enroll: 800,
      modules: 12,
      img: "https://source.unsplash.com/400x250/?science,books",
    },
    {
      title: "History Insights",
      rating: 4.4,
      enroll: 600,
      modules: 8,
      img: "https://source.unsplash.com/400x250/?history,library",
    },
  ];

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
        {courses.map((c, i) => (
          <Card
            key={i}
            className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <img src={c.img} alt={c.title} className="w-full h-40 object-cover" />
            <CardContent className="p-4">
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
    </motion.div>
  );
}
