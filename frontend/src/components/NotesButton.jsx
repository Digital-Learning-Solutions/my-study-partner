import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function NotesButton({ videoUrl, title, id }) {
  const [loading, setLoading] = useState(false);

  async function generateAndDownloadNotes() {
    setLoading(true);

    try {
      // 1. Fetch transcript
      const transcriptRes = await fetch(
        `${BACKEND_URL}/api/course/get-transcript`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl }),
        }
      );

      if (!transcriptRes.ok) throw new Error("Failed to fetch transcript");

      const transcriptData = await transcriptRes.json();
      const plainText = transcriptData.text;

      // 2. Generate Notes PDF
      const notesRes = await fetch(`${BACKEND_URL}/api/course/generate-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plainText, id }),
      });

      if (!notesRes.ok) throw new Error("Failed to generate notes");

      const data = await notesRes.json();

      // PDF URL returned by backend
      const fileUrl = `${BACKEND_URL}${data.file}`;

      // ✅ 3. PREVIEW PDF instead of downloading
      window.open(fileUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to generate notes. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={generateAndDownloadNotes}
      disabled={loading}
      className="mt-6 px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 
      disabled:bg-purple-400 dark:bg-purple-700 dark:hover:bg-purple-600 transition"
    >
      {loading ? "⏳ Generating Notes..." : "📝 Download Notes"}
    </button>
  );
}
