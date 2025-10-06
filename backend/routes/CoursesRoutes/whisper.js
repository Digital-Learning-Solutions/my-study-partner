// utils/speechToText.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function speechToText(audioStream) {
  try {
    // OpenAI expects a File/Blob or stream-like object for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (err) {
    console.error("[ERROR] Speech to text failed:", err.message);
    throw err;
  }
}
