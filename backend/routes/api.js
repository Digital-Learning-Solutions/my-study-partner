import express from "express";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import Question from "../models/Question.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  // {
  //   id: "s3",
  //   question: "Which planet is known as the Red Planet?",
  //   options: ["Earth", "Mars", "Jupiter", "Venus"],
  //   answer: 1,
  // },
  // {
  //   id: "s4",
  //   question: "What is the largest mammal in the world?",
  //   options: ["African Elephant", "Blue Whale", "Giraffe", "Orca"],
  //   answer: 1,
  // },
  // {
  //   id: "s5",
  //   question: "Which language is primarily used for styling web pages?",
  //   options: ["HTML", "CSS", "JavaScript", "Python"],
  //   answer: 1,
  // },
];

  res.json({ success: true, questions: sample });
});

// ✅ Upload notes (text or file) and generate quiz using Gemini
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

    // Call Gemini API
    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();

    // 🛠 Remove markdown code fences if present
    output = output
      .replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(output);
    } catch (e) {
      console.error("❌ JSON parse error:", e);
      return res
        .status(500)
        .json({ success: false, message: "Invalid JSON from AI", raw: output });
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
