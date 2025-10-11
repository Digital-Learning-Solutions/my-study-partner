// src/components/DiscussionCard.jsx
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import ReplyCard from "./ReplyCard";

export default function DiscussionCard({ discussion }) {
  const [data, setData] = useState(discussion);
  const [reply, setReply] = useState("");

  const upvote = () => setData({ ...data, upvotes: data.upvotes + 1 });
  const downvote = () => setData({ ...data, downvotes: data.downvotes + 1 });

  const addReply = () => {
    if (!reply.trim()) return;
    setData({
      ...data,
      replies: [...(data.replies || []), { text: reply, author: "UserXYZ" }],
    });
    setReply("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 className="font-semibold text-lg">{data.question}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        by {data.author} • {data.time}
      </p>

      <div className="flex gap-3 mt-2">
        <button onClick={upvote} className="flex items-center gap-1">
          <ThumbsUp size={16} /> {data.upvotes}
        </button>
        <button onClick={downvote} className="flex items-center gap-1">
          <ThumbsDown size={16} /> {data.downvotes}
        </button>
      </div>

      {/* Replies */}
      <div className="mt-3">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply..."
          className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700"
        />
        <button
          onClick={addReply}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md"
        >
          Reply
        </button>

        <div className="mt-3 space-y-2">
          {data.replies?.map((r, i) => (
            <ReplyCard key={i} reply={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
