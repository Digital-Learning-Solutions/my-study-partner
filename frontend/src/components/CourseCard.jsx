import { Star } from "lucide-react";
import { Card, CardContent } from "./ui/Card";

export default function CourseCard({ course }) {
  // Calculate average rating from ratings array
  const ratings = course.ratings || [];
  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : 0;

  return (
    <Card className="overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform">
      {/* Course Image */}
      <div className="w-full aspect-[16/9] overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>

      {/* Card Content */}
      <CardContent>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Rating row */}
        <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
          <Star size={16} fill="gold" className="mr-1" />
          {averageRating}
          <span className="text-slate-500 dark:text-slate-400 ml-1">
            ({ratings.length})
          </span>
        </div>

        {/* Enroll + Modules */}
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Enrolled: {course.enrollCount}</span>
          <span>Modules: {course.moduleCount}</span>
        </div>
      </CardContent>
    </Card>
  );
}
