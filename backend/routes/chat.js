import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const chatRouter = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

chatRouter.post("/", async (req, res) => {
  try {
    const { prompt } = req.body; // ✅ only take current prompt

    const result = await model.generateContent(prompt); // ✅ no chat, no history
    const output = result.response.text();

    res.json({ success: true, answer: output });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      success: false,
      answer: "Service Unavailable.",
    });
  }
});

export default chatRouter;
