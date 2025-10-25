// src/components/SidebarSections.jsx
import React from "react";
import { useDiscussion } from "../../context/DiscussionContext";
import { useNavigate } from "react-router-dom";

export default function SidebarSections({ onSelect, active }) {
  const { sections, enrolled, toggleEnroll, userId } = useDiscussion();
  const navigate = useNavigate();

  return (
    <aside className="w-64 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Sections</h3>
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.key} className="flex items-center justify-between">
            <button
              onClick={() => {
                if (onSelect) onSelect(s.key);
                // navigate to the section route
                navigate(`/discussions/section/${s.key}`);
              }}
              className={`text-left w-full py-2 px-3 rounded ${
                active === s.key
                  ? "bg-slate-100 dark:bg-slate-700"
                  : "hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium dark:text-white">{s.name}</span>
                <small className="text-sm text-slate-500 dark:text-slate-300">
                  {s.discussionCount || 0}
                </small>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {s.tags.slice(0, 3).join(", ")}
              </div>
            </button>
            <button
              onClick={() => toggleEnroll(s.key)}
              title={enrolled.includes(s.key) ? "Unenroll" : "Enroll"}
              className={`ml-2 py-1 px-2 rounded text-sm ${
                enrolled.includes(s.key) ? "bg-blue-600 text-white" : "border"
              }`}
            >
              {enrolled.includes(s.key) ? "Enrolled" : "Join"}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
