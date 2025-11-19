// src/components/CourseSkeleton.jsx
import React from "react";

export default function CourseSkeleton({ className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-slate-800 border border-border dark:border-white/10 shadow-soft overflow-hidden ${className}`}
    >
      {/* Image skeleton */}
      <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-slate-700 animate-pulse" />

      {/* Text skeleton */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2 animate-pulse" />

        {/* Footer row skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-12 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
