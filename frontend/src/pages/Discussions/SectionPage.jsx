// src/pages/SectionPage.jsx
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import DiscussionForm from "../../components/DiscussionForm";
import DiscussionCard from "../../components/DiscussionCard";

export default function SectionPage() {
  const { name } = useParams();
  const [discussions, setDiscussions] = useState([]);

  const addDiscussion = (newDisc) => {
    setDiscussions([
      ...discussions,
      { ...newDisc, section: name, upvotes: 0, downvotes: 0, replies: [] },
    ]);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold mb-4">Sections</h2>
        <Link
          to="/"
          className="block text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to All Sections
        </Link>
      </div>

      {/* Discussion Area */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">{name}</h1>

        <DiscussionForm onPost={addDiscussion} />

        <div className="mt-6 space-y-4">
          {discussions.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              No discussions yet. Be the first to ask a question!
            </p>
          )}
          {discussions.map((d, i) => (
            <DiscussionCard key={i} discussion={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
