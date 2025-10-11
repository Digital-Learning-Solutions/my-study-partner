// src/pages/DiscussionPage.jsx
import { Link } from "react-router-dom";

const sections = [
  "Machine Learning",
  "Cloud Computing",
  "Frontend",
  "Backend",
  "Data Science",
  "DevOps",
  "Cyber Security",
];

export default function DiscussionPage() {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold mb-4">Discussion Topics</h2>
        <ul className="space-y-3">
          {sections.map((section) => (
            <li key={section}>
              <Link
                to={`/section/${encodeURIComponent(section)}`}
                className="block px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {section}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main placeholder area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold mb-2">💬 Choose a Topic</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select a discussion section from the left to join or start posting
          questions.
        </p>
      </div>
    </div>
  );
}
