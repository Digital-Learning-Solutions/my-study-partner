import { pipeline } from "@xenova/transformers";

// Load the model once
let classifier = null;
async function loadModel() {
  if (!classifier) {
    console.log("⏳ Loading toxic-bert ML model...");
    classifier = await pipeline("text-classification", "Xenova/toxic-bert");
    console.log("✅ toxic-bert model loaded successfully");
  }
}

/**
 * Returns:
 * { detected: boolean, reason: string[], score: number, raw: {...} }
 */
export const containsHateSpeech = async (text) => {
  await loadModel();

  // 1. Local fallback check
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

  // 2. ML model check
  try {
    const result = await classifier(text);
    console.log("🧠 ML toxic-bert Result:", result);

    const label = result[0].label.toUpperCase();
    const score = result[0].score;

    // toxic-bert labels:
    // - TOXIC
    // - OBSCENE
    // - THREAT
    // - INSULT
    // - IDENTITY_HATE
    // - NON_TOXIC

    const toxicLabels = [
      "TOXIC",
      "OBSCENE",
      "THREAT",
      "INSULT",
      "IDENTITY_HATE",
    ];

    if (toxicLabels.includes(label) && score >= 0.3) {
      return {
        detected: true,
        reason: [label],
        score,
        raw: result,
      };
    }

    return {
      detected: false,
      reason: ["CLEAN"],
      score,
      raw: result,
    };
  } catch (err) {
    console.error("💥 ML model error:", err);
    return {
      detected: false,
      reason: ["ML_ERROR"],
      score: null,
      raw: err,
    };
  }
};
