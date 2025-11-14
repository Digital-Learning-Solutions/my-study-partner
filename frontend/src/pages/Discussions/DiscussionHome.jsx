// src/pages/DiscussionHome.jsx
import React, { useEffect, useState } from "react";
import SidebarSections from "../../components/Discussion/SidebarSections";
import DiscussionCard from "../../components/Discussion/DiscussionCard";
import Pagination from "../../components/Discussion/Pagination";
import NewQuestionModal from "../../components/Discussion/NewQuestionModal";
import { useParams } from "react-router-dom";
import { useDiscussionContext } from "../../context/useDiscussionContext";
import { useStoredContext } from "../../context/useStoredContext";

export default function DiscussionHome() {
  const { fetchDiscussions, listState, urlParamToTitle } =
    useDiscussionContext();
  const { sectionKey } = useParams();
  const [selectedSection, setSelectedSection] = useState(sectionKey || null);
  const [showNew, setShowNew] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: "recent",
  });
  const [showReminder, setShowReminder] = useState(false);
  const { user } = useStoredContext();

  // Keep selectedSection in sync with the URL (handles browser back/forward)
  useEffect(() => {
    setSelectedSection(sectionKey || null);
    setFilters((prev) => ({ ...prev, page: 1 }));

    // Track recent activity
    if (user) {
      const activity = {
        title: selectedSection
          ? urlParamToTitle(selectedSection)
          : "All Discussions",
        type: "Discussion",
        url: `/discussions${
          selectedSection ? `/section/${selectedSection}` : ""
        }`,
        timestamp: new Date().toISOString(),
      };
      const activities = JSON.parse(
        localStorage.getItem("recentActivities") || "[]"
      );
      activities.unshift(activity);
      localStorage.setItem(
        "recentActivities",
        JSON.stringify(activities.slice(0, 10))
      ); // Keep last 10
    }
  }, [sectionKey, user, urlParamToTitle, selectedSection]);

  useEffect(() => {
    fetchDiscussions(filters, selectedSection);
  }, [filters, selectedSection, fetchDiscussions]);

  const handleNewQuestionClick = () => {
    const hideReminder = localStorage.getItem("hideReminder");
    if (!hideReminder) {
      setShowReminder(true);
    } else {
      setShowNew(true);
    }
  };

  const handleReminderClose = (dontShowAgain) => {
    setShowReminder(false);
    if (dontShowAgain) localStorage.setItem("hideReminder", "true");
    setShowNew(true);
  };

  // handle page change and scroll to top
  const handlePage = (p) => {
    setFilters((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 flex gap-6">
      <SidebarSections
        onSelect={(k) => setSelectedSection(k)}
        active={selectedSection}
      />
      <main className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold dark:text-white">
            {selectedSection
              ? urlParamToTitle(selectedSection)
              : "All Discussions"}
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
              onClick={handleNewQuestionClick}
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
          onPage={handlePage}
        />
      </main>

      {showReminder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Please post thoughtfully
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We encourage respectful and clear communication. Questions that
              receive valid reports or are identified as containing
              inappropriate or harmful language may lead to a temporary
              restriction on posting.
            </p>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    localStorage.setItem("hideReminder", e.target.checked)
                  }
                />
                Don’t show this reminder again
              </label>
              <button
                onClick={() => handleReminderClose()}
                className="bg-blue-600 text-white px-4 py-1.5 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <NewQuestionModal
          section={selectedSection || ""}
          onClose={() => setShowNew(false)}
          onCreated={() => fetchDiscussions(filters, selectedSection)}
        />
      )}
    </div>
  );
}
