/**
 * Returns:
 * { detected: boolean, reason: string[], score: number, raw: {...} }
 */
export const containsHateSpeech = async (text) => {
  // Local keyword-based check
  const badWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "bastard",
    "idiot",
    "moron",
    "nonsense",
    "stupid",
    "retard",
  ];

  const lower = (text || "").toLowerCase();
  const hits = badWords.filter((w) => lower.includes(w));

  if (hits.length > 0) {
    console.log("🔎 Local keyword match:", hits);
    return {
      detected: true,
      reason: ["LOCAL_KEYWORD"],
      score: null,
      raw: hits,
    };
  }

  return {
    detected: false,
    reason: ["CLEAN"],
    score: null,
    raw: [],
  };
};
