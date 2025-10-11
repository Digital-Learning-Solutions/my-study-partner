// src/components/ReplyCard.jsx
export default function ReplyCard({ reply }) {
  return (
    <div className="ml-4 mt-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700">
      <p>{reply.text}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        – {reply.author}
      </p>
    </div>
  );
}
