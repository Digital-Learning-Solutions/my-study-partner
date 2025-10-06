import { Star } from "lucide-react";
function Card({ children, className }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
export default function CourseCard({ course }) {
  return (
    <Card className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-40 object-cover"
      />
      <CardContent>
        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
        <div className="flex items-center text-sm text-yellow-500 mb-2">
          <Star size={16} fill="gold" className="mr-1" /> {course.rating}
        </div>
        <p className="text-sm">Enrolled: {course.enrollCount}</p>
        <p className="text-sm">Modules: {course.moduleCount}</p>
      </CardContent>
    </Card>
  );
}
