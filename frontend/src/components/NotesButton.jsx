import { useState } from "react";

export default function NotesButton({ videoUrl, title, id }) {
  const [loading, setLoading] = useState(false);

  async function generateAndDownloadNotes() {
    setLoading(true);

    try {
      // ✅ 1. Fetch transcript from backend
      const transcriptRes = await fetch(
        "http://localhost:5000/api/course/get-transcript",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl }),
        }
      );

      if (!transcriptRes.ok) throw new Error("Failed to fetch transcript");

      const transcriptData = await transcriptRes.json();
      const plainText = transcriptData.text;

      // ✅ 2. Send transcript to notes generator
      const formData = new FormData();
      formData.append("text", plainText);

      const notesRes = await fetch(
        "http://localhost:5000/api/course/generate-notes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: plainText, id }),
        }
      );

      if (!notesRes.ok) throw new Error("Failed to generate notes");

      const data = await notesRes.json();

      // ✅ 3. Final generated notes (formatted)
      const notes = data.notes || "No notes generated.";

      // ✅ 4. Auto-download notes file
      const blob = new Blob([notes], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}-notes.txt`;
      a.click();

      URL.revokeObjectURL(url);
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
