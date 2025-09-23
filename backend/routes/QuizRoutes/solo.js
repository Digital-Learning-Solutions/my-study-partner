// backend/routes/solo.js
import express from "express";
import { generateQuestionsFromText } from "../../services/openaiService.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { topicOrNotes } = req.body;

    if (!topicOrNotes || topicOrNotes.trim() === "") {
      return res
        .status(400)
        .json({ error: "Please provide a topic or notes." });
    }

    const questions = await generateQuestionsFromText(topicOrNotes);

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(500)
        .json({ error: "Failed to generate valid questions." });
    }

    res.json({ questions });
  } catch (error) {
    console.error("Solo mode generation error:", error);
    res.status(500).json({ error: "Error generating questions." });
  }
});

export default router;
