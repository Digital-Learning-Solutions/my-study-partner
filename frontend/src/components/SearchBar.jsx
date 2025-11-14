import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SearchResultCard({ course }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <img
        src={course.image}
        alt={course.title}
        className="w-16 h-16 object-cover rounded-lg border"
      />
      <div className="flex-1 text-left">
        <div className="font-semibold text-lg text-sky-700 dark:text-sky-300">
          {course.title}
        </div>
        <div className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {course.description}
        </div>
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Type: {course.courseType}</span>
          <span>Modules: {course.moduleCount}</span>
          <span>Enrolled: {course.enrollCount}</span>
          <span>Rating: {course.rating}</span>
        </div>
      </div>
    </div>
  );
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    async function fetchCourses() {
      try {
        const response = await fetch("http://localhost:5000/api/course/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        const filtered = data.courses.filter((c) =>
          c.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        console.log("Search results:", filtered);
      } catch (error) {
        setResults([]);
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, [query]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <input
        type="text"
        placeholder="Search for courses..."
        className="w-full p-4 rounded-2xl shadow-md text-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-2 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No courses found.
            </div>
          ) : (
            results.map((c, i) => (
              <Link
                key={i}
                to={`/courses/${c.courseType}/${c._id || c.id}`}
                className="block border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-sky-50 dark:hover:bg-sky-900 transition"
              >
                <SearchResultCard course={c} />
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
