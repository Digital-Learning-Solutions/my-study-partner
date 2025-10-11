import { useState } from "react";
import { Star } from "lucide-react";

export default function CourseRating({ courseId, currentRating, onRated }) {
  const [rating, setRating] = useState(currentRating || 0);
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleRate(value) {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/rate/${courseId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: value }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to rate course");

      setRating(value);
      onRated && onRated(data.newRating);
    } catch (err) {
      console.error(err);
      alert("Error rating course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          disabled={loading}
          onClick={() => handleRate(value)}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(null)}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              value <= (hover || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">
        {rating ? `${rating} / 5` : "Not rated yet"}
      </span>
    </div>
  );
}
