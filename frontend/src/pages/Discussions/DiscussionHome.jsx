// src/pages/DiscussionHome.jsx
import React, { useEffect, useState } from "react";
import { useDiscussion } from "../../context/DiscussionContext";
import SidebarSections from "../../components/Discussion/SidebarSections";
import DiscussionCard from "../../components/Discussion/DiscussionCard";
import Pagination from "../../components/Discussion/Pagination";
import NewQuestionModal from "../../components/Discussion/NewQuestionModal";
import { useParams } from "react-router-dom";

export default function DiscussionHome() {
  const { fetchDiscussions, listState } = useDiscussion();
  const { sectionKey } = useParams();
  const [selectedSection, setSelectedSection] = useState(sectionKey || null);
  const [showNew, setShowNew] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: "recent",
  });

  // Keep selectedSection in sync with the URL (handles browser back/forward)
  useEffect(() => {
    setSelectedSection(sectionKey || null);
    // reset to first page when section changes via routing
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [sectionKey]);

  useEffect(() => {
    fetchDiscussions({ ...filters, section: selectedSection });
  }, [filters.page, selectedSection, filters.sort]);

  return (
    <div className="p-6 flex gap-6">
      <SidebarSections
        onSelect={(k) => setSelectedSection(k)}
        active={selectedSection}
      />
      <main className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold dark:text-white">
            {selectedSection ? selectedSection : "All Discussions"}
          </h2>
          <div className="flex gap-2">
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value, page: 1 })
              }
              className="border rounded px-2 py-1"
            >
              <option value="recent">Recent</option>
              <option value="popular">Popular</option>
              <option value="trending">Trending</option>
            </select>
            <button
              onClick={() => setShowNew(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              New Question
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {listState.data.map((d) => (
            <DiscussionCard key={d.id} d={d} />
          ))}
        </div>

        <Pagination
          page={listState.page}
          total={listState.total}
          limit={listState.limit}
          onPage={(p) => setFilters((prev) => ({ ...prev, page: p }))}
        />
      </main>
      {showNew && (
        <NewQuestionModal
          section={selectedSection || "general"}
          onClose={() => setShowNew(false)}
          onCreated={() => fetchDiscussions(filters)}
        />
      )}
    </div>
  );
}
