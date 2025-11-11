// services/openaiService.js
import axios from "axios";

export async function generateQuestionsFromNotes(notesText) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a quiz generator. Given some notes, create a list of 10 multiple-choice questions with 4 options each and mark the correct one.",
        },
        {
          role: "user",
          content: `Here are my notes:\n\n${notesText}\n\nPlease generate the quiz in JSON format: [{"question": "...", "options": ["..."], "answer": "..."}]`,
        },
      ],
      max_tokens: 1000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Parse JSON output safely
  const content = response.data.choices?.[0]?.message?.content || "[]";
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Error parsing AI output:", err);
    return [];
  }
}

// backend/services/openaiService.js
import fetch from "node-fetch";

export async function generateQuestionsFromText(notesText) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a quiz generator. Given text or a topic, return exactly 10 multiple-choice questions in this strict JSON format: [{question:'',options:['','','',''],answer:''}]. Do not include any extra text.",
          },
          {
            role: "user",
            content: notesText,
          },
        ],
        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();

  if (!data.choices || !data.choices.length) {
    throw new Error("No response from AI");
  }

  let questions;
  try {
    questions = JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error("AI response parse error:", data.choices[0].message.content);
    throw new Error("Invalid JSON from AI");
  }

  return questions;
}
