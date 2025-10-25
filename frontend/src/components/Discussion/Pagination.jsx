// src/components/Pagination.jsx
import React from "react";

export default function Pagination({ page, total, limit, onPage }) {
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="flex gap-2 items-center mt-4">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="px-3 py-1 border rounded"
      >
        Prev
      </button>
      <div className="text-sm">
        Page {page} / {totalPages || 1}
      </div>
      <button
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        className="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>
  );
}
