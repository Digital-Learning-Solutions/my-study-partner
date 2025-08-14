import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch"; // ✅ Needed to call OpenAI API in Node
import dotenv from "dotenv";
import Question from "../models/Question.js";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Sample questions endpoint
router.get("/questions/sample", (req, res) => {
  const sample = [
    {
      id: "s1",
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      answer: 0,
    },
    {
      id: "s2",
      question: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "Home Tool Markup",
        "Hyperlink and Text Mark",
        "HighText Markup Language",
      ],
      answer: 0,
    },
  ];
  res.json({ success: true, questions: sample });
});

// ✅ Upload notes (text or file) and generate quiz
router.post("/upload-notes", upload.single("file"), async (req, res) => {
  try {
    let text = req.body.text || "";

    // If a file is uploaded, read it as text
    if (req.file) {
      const filePath = req.file.path;
      text = fs.readFileSync(filePath, "utf8");
      fs.unlinkSync(filePath); // Delete uploaded file after reading
    }

    if (!text.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "No notes provided" });
    }

    const prompt = `
      You are a quiz generator.
      Based on these notes:
      "${text}"

      Generate 5 multiple-choice questions.
      Each question should be JSON in this exact format:
      {
        "question": "string",
        "options": ["opt1","opt2","opt3","opt4"],
        "answer": index_of_correct_option (0-based)
      }

      Return ONLY a JSON array, no extra text.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!data.choices?.length) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to generate questions" });
    }

    let rawOutput = data.choices[0].message.content.trim();

    // Try to parse JSON
    let questions;
    try {
      questions = JSON.parse(rawOutput);
    } catch {
      return res
        .status(500)
        .json({ success: false, message: "Invalid JSON from AI" });
    }

    // Optional: Save to MongoDB
    try {
      await Question.insertMany(
        questions.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
        }))
      );
    } catch (dbErr) {
      console.warn("⚠️ DB insert failed:", dbErr.message);
    }

    res.json({ success: true, questions });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
