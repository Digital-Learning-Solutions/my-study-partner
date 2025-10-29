// src/components/SidebarSections.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDiscussionContext } from "../../context/useDiscussionContext";

export default function SidebarSections({ onSelect, active }) {
  const { sections, enrolled, toggleEnroll, userId } = useDiscussionContext();
  const navigate = useNavigate();
  console.log("sidebar", sections);

  return (
    <aside className="w-64 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Sections</h3>
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.slug} className="flex items-center justify-between">
            <button
              onClick={() => {
                if (onSelect) onSelect(s.slug);
                // navigate to the section route
                navigate(`/discussions/section/${s.slug}`);
              }}
              className={`text-left w-full py-2 px-3 rounded ${
                active === s.slug
                  ? "bg-slate-100 dark:bg-slate-700"
                  : "hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium dark:text-white">{s.name}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {s.tags.slice(0, 3).join(", ")}
              </div>
            </button>
            <button
              onClick={() => toggleEnroll(s.slug)}
              title={enrolled.includes(s.slug) ? "Unenroll" : "Enroll"}
              className={`ml-2 py-1 px-2 rounded text-sm ${
                enrolled.includes(s.slug) ? "bg-blue-600 text-white" : "border"
              }`}
            >
              {enrolled.includes(s.slug) ? "Enrolled" : "Join"}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
