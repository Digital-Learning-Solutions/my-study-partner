// src/pages/GroupSearchPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GroupSearchPage() {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ FIXED useEffect (no async return)
  useEffect(() => {
    async function fetchInitial() {
      await loadGroups("");
    }
    fetchInitial();
  }, []);

  async function loadGroups(searchTerm) {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/quiz-groups?search=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await res.json();
      setGroups(data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Find Groups</h2>

      {/* Search Bar */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          loadGroups(e.target.value);
        }}
        placeholder="Search group by name..."
        className="
          w-full p-4 rounded-xl 
          bg-white dark:bg-gray-800 
          border dark:border-gray-700 shadow
        "
      />

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex items-center gap-4"
              style={{ minHeight: "80px" }}
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Always reserve 5 slots */}
          {[0, 1, 2, 3, 4].map((i) => {
            const g = groups[i];

            return (
              <div
                key={i}
                className={`
                  rounded-xl flex items-center gap-4 transition
                  ${
                    g
                      ? "p-4 bg-white dark:bg-gray-800 shadow hover:shadow-xl hover:scale-[1.01]"
                      : ""
                  }
                `}
                style={{ minHeight: "80px" }}
              >
                {g ? (
                  <>
                    {/* Avatar */}
                    <div
                      className="
                        w-12 h-12 flex items-center justify-center rounded-full
                        bg-indigo-200 dark:bg-indigo-500 font-bold
                        text-indigo-700 dark:text-white
                      "
                    >
                      {g.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold dark:text-white">
                        {g.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {g.description || "No description"}
                      </p>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() =>
                        navigate(`/quiz/multiplayer/quiz-groups/${g._id}`)
                      }
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                      View
                    </button>
                  </>
                ) : (
                  // Invisible placeholder to keep fixed height
                  <div className="opacity-0 w-full h-full"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
