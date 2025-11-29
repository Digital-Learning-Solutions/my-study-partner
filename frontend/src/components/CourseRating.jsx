import { useState, useEffect } from "react";
import { Star, CheckCircle } from "lucide-react";
import { useStoredContext } from "../context/useStoredContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CourseRating({
  courseId,
  ratings,
  onRated,
  isEnrolled,
}) {
  const { user } = useStoredContext();

  const currentUserRating =
    ratings?.find((r) => r.userId === user?._id)?.rating || 0;

  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [justRated, setJustRated] = useState(false);
  const [userRating, setUserRating] = useState(currentUserRating);

  // Sync rating if refreshed
  useEffect(() => {
    setUserRating(currentUserRating);
  }, [currentUserRating]);

  async function handleRate(value) {
    if (!user) return alert("Login to rate the course");
    if (!isEnrolled) return alert("Enroll in the course to rate it");
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/course/rate/${courseId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, rating: value }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update UI instantly
      setUserRating(value);
      setJustRated(true);
      setTimeout(() => setJustRated(false), 2000);

      onRated && onRated(data.newRating, value);
    } catch (err) {
      console.error(err);
      alert("Rating failed");
    } finally {
      setLoading(false);
    }
  }

  const averageRating =
    ratings?.length > 0
      ? (
          ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const showFilled =
            isEnrolled && (hover ? value <= hover : value <= userRating);

          return (
            <button
              key={value}
              disabled={loading || !isEnrolled}
              onClick={() => handleRate(value)}
              onMouseEnter={() => isEnrolled && setHover(value)}
              onMouseLeave={() => isEnrolled && setHover(null)}
              className={`${!isEnrolled ? "cursor-not-allowed" : ""}`}
            >
              <Star
                className={`w-7 h-7 transition-all duration-200 ${
                  showFilled
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Rating Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        ⭐ <strong>{averageRating}</strong> / 5 — based on{" "}
        <strong>{ratings?.length || 0}</strong> ratings
      </div>

      {/* Your Rating */}
      {user && isEnrolled && (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          Your rating:{" "}
          <strong className="text-gray-700 dark:text-gray-200">
            {userRating || "Not yet rated"}
          </strong>
          {/* NEW: Rated Chip */}
          {justRated && (
            <span className="flex items-center text-green-600 dark:text-green-400 ml-2">
              <CheckCircle size={14} className="mr-1" />
              Rated!
            </span>
          )}
        </div>
      )}

      {/* Not enrolled message */}
      {!isEnrolled && (
        <div className="text-xs text-red-500 dark:text-red-400">
          Enroll to rate this course
        </div>
      )}
    </div>
  );
}
