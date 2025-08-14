// frontend/src/api.js
export async function generateSoloQuestions(topicOrNotes) {
  const res = await fetch("/api/solo/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topicOrNotes })
  });

  if (!res.ok) throw new Error("Failed to generate questions");
  return await res.json();
}
