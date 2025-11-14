import fetch from "node-fetch";

/**
 * Returns an object:
 * { detected: boolean, reason: string[], scores: { ... }, raw: {...} }
 */
export const containsHateSpeech = async (text) => {
  // deterministic local fallback list (fast and guaranteed)
  const localStrongWords = [
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

  const lowerText = (text || "").toLowerCase();

  // immediate local check — helps when API fails or for guaranteed obvious catches
  const localHit = localStrongWords.filter((w) => lowerText.includes(w));
  if (localHit.length > 0) {
    console.log("🔎 Local fallback matched:", localHit);
    return {
      detected: true,
      reason: ["LOCAL_KEYWORD"],
      scores: null,
      raw: null,
    };
  }

  // --- Check API key presence early ---
  const KEY = process.env.PERSPECTIVE_API_KEY;
  if (!KEY) {
    console.error("❌ PERSPECTIVE_API_KEY is not set in process.env");
    // fallback to local only (already checked) — return false if nothing matched
    return { detected: false, reason: ["NO_API_KEY"], scores: null, raw: null };
  }

  try {
    const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${KEY}`;
    const body = {
      comment: { text },
      languages: ["en"],
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        INSULT: {},
        THREAT: {},
        IDENTITY_ATTACK: {},
        PROFANITY: {},
      },
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await resp.text(); // read raw text first for better diagnostics
    let result;
    try {
      result = JSON.parse(raw);
    } catch (parseErr) {
      console.error(
        "❌ Could not parse Perspective API JSON:",
        parseErr,
        "raw:",
        raw
      );
      return {
        detected: false,
        reason: ["INVALID_API_RESPONSE"],
        scores: null,
        raw,
      };
    }

    // If API returned a non-2xx, log error details
    if (!resp.ok) {
      console.error("❌ Perspective API HTTP error:", resp.status, result);
      return {
        detected: false,
        reason: ["API_HTTP_ERROR"],
        scores: null,
        raw: result,
      };
    }

    // Log the full response for debugging
    console.log(
      "🧾 Perspective raw response:",
      JSON.stringify(result, null, 2)
    );

    const attributes = result.attributeScores;
    if (!attributes) {
      console.warn("⚠️ No attributeScores present in API response", result);
      return {
        detected: false,
        reason: ["NO_ATTRIBUTES"],
        scores: null,
        raw: result,
      };
    }

    const scores = {
      toxicity: attributes.TOXICITY?.summaryScore?.value || 0,
      severeToxicity: attributes.SEVERE_TOXICITY?.summaryScore?.value || 0,
      insult: attributes.INSULT?.summaryScore?.value || 0,
      threat: attributes.THREAT?.summaryScore?.value || 0,
      identityAttack: attributes.IDENTITY_ATTACK?.summaryScore?.value || 0,
      profanity: attributes.PROFANITY?.summaryScore?.value || 0,
    };

    console.log("🧠 Parsed Perspective Scores:", scores);

    // choose threshold depending on how sensitive you want it
    const threshold = 0.5; // adjust: 0.4-0.6 recommended for prod sensitivity
    const triggered = Object.entries(scores)
      .filter(([k, v]) => v >= threshold)
      .map(([k]) => k);

    if (triggered.length > 0) {
      return { detected: true, reason: triggered, scores, raw: result };
    }

    // nothing triggered from API and local fallback already checked
    return { detected: false, reason: ["CLEAN"], scores, raw: result };
  } catch (err) {
    console.error("💥 Error while calling Perspective API:", err);
    return {
      detected: false,
      reason: ["API_CALL_ERROR"],
      scores: null,
      raw: err?.message || err,
    };
  }
};
