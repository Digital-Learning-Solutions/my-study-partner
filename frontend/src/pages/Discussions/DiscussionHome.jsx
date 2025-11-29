import React, { useEffect, useState } from "react";
import SidebarSections from "../../components/Discussion/SidebarSections";
import DiscussionCard from "../../components/Discussion/DiscussionCard";
import Pagination from "../../components/Discussion/Pagination";
import NewQuestionModal from "../../components/Discussion/NewQuestionModal";
import { Link, useParams } from "react-router-dom";
import { useDiscussionContext } from "../../context/useDiscussionContext";
import { useStoredContext } from "../../context/useStoredContext";
import categories from "../../utils/Category";
export default function DiscussionHome() {
  console.log("Rendering DiscussionHome");
  const {
    fetchDiscussions,
    listState,
    urlParamToTitle,
    toggleEnroll,
    enrolled,
    sections,
  } = useDiscussionContext();

  const { sectionKey } = useParams();
  const [selectedSection, setSelectedSection] = useState(sectionKey || null);
  const [showNew, setShowNew] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: "recent",
  });
  const [category, setCategory] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const { user } = useStoredContext();

  // Sync with URL once
  useEffect(() => {
    setCategory(categories.find((cat) => cat.slug === sectionKey) || null);
    console.log("Category: ", category);

    setSelectedSection(sectionKey || null);
    setFilters((prev) => ({ ...prev, page: 1 }));

    if (user) {
      const activity = {
        title: sectionKey ? urlParamToTitle(sectionKey) : "All Discussions",
        type: "Discussion",
        url: `/discussions${sectionKey ? `/section/${sectionKey}` : ""}`,
        timestamp: new Date().toISOString(),
      };

      const activities = JSON.parse(
        localStorage.getItem("recentActivities") || "[]"
      );

      activities.unshift(activity);
      localStorage.setItem(
        "recentActivities",
        JSON.stringify(activities.slice(0, 10))
      );
    }
  }, [category, sectionKey]);

  useEffect(() => {
    fetchDiscussions(filters, selectedSection);
  }, [filters, selectedSection, fetchDiscussions]);

  const handleNewQuestionClick = () => {
    const hideReminder = localStorage.getItem("hideReminder");
    if (!hideReminder) setShowReminder(true);
    else setShowNew(true);
  };

  const handleReminderClose = (dontShowAgain) => {
    setShowReminder(false);
    if (dontShowAgain) localStorage.setItem("hideReminder", "true");
    setShowNew(true);
  };

  const handlePage = (p) => {
    setFilters((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Section Details
  const activeSectionObj = sections?.find((s) => s.slug === selectedSection);
  const isEnrolled = enrolled?.includes(selectedSection); // ⭐ SAME LOGIC AS SIDEBAR

  return (
    <div className="p-6 flex gap-6">
      {/* Sidebar */}
      <SidebarSections
        onSelect={(k) => setSelectedSection(k)}
        active={selectedSection}
      />

      {/* Main */}
      <main className="flex-1">
        {/* Header */}
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
                setFilters((prev) => ({
                  ...prev,
                  sort: e.target.value,
                  page: 1,
                }))
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

        {/* ---------------- ⭐ JOIN COMMUNITY BANNER (Synced with Sidebar) ---------------- */}
        {selectedSection && activeSectionObj && (
          <div
            className="
      mb-8 p-8 rounded-2xl 
      bg-white dark:bg-slate-800 
      border border-gray-200 dark:border-slate-700 
      shadow-xl transition-all
    "
          >
            {/* Title + Join Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left Section */}
              <div className="flex-1">
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">
                  {activeSectionObj.name} Community
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  Welcome to the {activeSectionObj.name} discussion space —
                  where students collaborate, ask questions, share insights, and
                  help each other grow. Whether you're learning, revising, or
                  mastering new concepts, this space is built for you.
                </p>

                {/* Explore Courses CTA */}
                <div className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
                  <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                    📘 Explore Courses for This Topic
                  </h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1 mb-3">
                    Access structured learning content tailored to this section.
                    Concepts, examples, quizzes, and guidance — all in one
                    place.
                  </p>

                  <Link
                    to={`/courses/${selectedSection}`}
                    className="
    inline-block px-4 py-2 rounded-lg text-sm font-semibold
    bg-indigo-600 text-white hover:bg-indigo-700 
    transition shadow-md
  "
                    state={category}
                  >
                    View Recommended Courses
                  </Link>
                </div>

                {/* Key Benefits */}
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700">
                    <h5 className="font-semibold text-slate-800 dark:text-white">
                      💬 Ask Doubts
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Get quick help from peers & experts.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700">
                    <h5 className="font-semibold text-slate-800 dark:text-white">
                      📚 Share Knowledge
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Help others with what you've learned.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700">
                    <h5 className="font-semibold text-slate-800 dark:text-white">
                      🚀 Grow Faster
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Learn together and improve steadily.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side — Join Button */}
              <div className="flex md:flex-col items-start gap-4">
                {!isEnrolled ? (
                  <button
                    onClick={async () => {
                      await toggleEnroll(selectedSection);
                      fetchDiscussions(filters, selectedSection);
                    }}
                    className="
              px-6 py-3 rounded-xl text-white font-semibold
              bg-blue-600 hover:bg-blue-700 shadow-lg
              transition-all
            "
                  >
                    Join Community
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Discussion Cards */}
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

      {/* Reminder Modal */}
      {showReminder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Please post thoughtfully
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Follow the community rules while posting.
            </p>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    localStorage.setItem("hideReminder", e.target.checked)
                  }
                />
                Don’t show this again
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
