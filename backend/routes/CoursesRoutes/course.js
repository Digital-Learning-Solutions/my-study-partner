import express from "express";
import CourseModel from "../../models/CourseModel/Course.js"; // your mongoose model
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { YoutubeTranscript } from "youtube-transcript";
import { downloadAudio } from "./audio_download.js";
import Course from "../../models/CourseModel/Course.js";
import User from "../../models/UserModel/user.js";
import { rateCourse } from "../../controllers/courses/courceEnroll.js";
import PDFDocument from "pdfkit";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const courseRouter = express.Router();

// Directory to cache transcripts
const transcriptDir = path.join(process.cwd(), "transcripts");
if (!fs.existsSync(transcriptDir)) fs.mkdirSync(transcriptDir);

// ✅ Fetch all courses
courseRouter.get("/all", async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

courseRouter.post("/rate/:courseId", rateCourse);

// ✅ Get a single course by MongoDB _id
courseRouter.get("/get-course/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const course = await CourseModel.findById(id);
    if (course) {
      res.status(200).json({ success: true, course });
    } else {
      res.status(404).json({ success: false, message: "Course not found" });
    }
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(400).json({ success: false, message: "Invalid course ID" });
  }
});

courseRouter.post("/generate-notes", async (req, res) => {
  try {
    const { text, id } = req.body;

    if (!text || !id) {
      return res.status(400).json({
        message: "Both 'text' and 'id' are required",
      });
    }

    // ✅ Sanitize ID to avoid invalid characters
    const safeId = sanitizeFilename(id);

    // ✅ Ensure notes folder exists
    const notesDir = path.join(process.cwd(), "notes");
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir);
    }

    // ✅ Final PDF path
    const pdfPath = path.join(notesDir, `${safeId}.pdf`);

    // ✅ 1. If PDF already exists → return directly
    try {
      if (fs.existsSync(pdfPath)) {
        return res.status(200).json({
          message: "Notes already exist",
          file: `/notes/${safeId}.pdf`,
          cached: true,
        });
      }
    } catch (err) {
      console.warn("⚠ File existence check failed, regenerating PDF...");
    }

    // ✅ 2. Generate notes using Gemini (if file not found)
    const prompt = `
Generate clean, well-organized study notes from the following transcript.

Strict Rules:
- NO Markdown formatting
- NO bold text (**like this**)
- NO headings using # or ## 
- NO stars (*) or hyphens (-) for bullets
- NO numbered lists
- NO special characters used for formatting
- Only plain text paragraphs separated by blank lines
- Use simple section titles written in uppercase (example: INTRODUCTION)
- Use simple bullet points using normal hyphens like this: 
  • Point one
  • Point two

Required Sections:
1. MAIN POINTS
2. DETAILED NOTES
3. SUMMARY

Return ONLY plain text.

Transcript:
${text}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const rawNotes = result.response.text().trim();
    const notes = rawNotes.replace(/```/g, "");

    // ✅ 3. Generate & Save PDF
    const pdfDoc = new PDFDocument({ margin: 40, size: "A4" });
    const writeStream = fs.createWriteStream(pdfPath);

    pdfDoc.pipe(writeStream);

    // Title
    pdfDoc
      .font("Times-Roman")
      .fontSize(20)
      .text(titleCase(id), { align: "center" });
    pdfDoc.moveDown();

    // Notes content
    pdfDoc.fontSize(12).text(notes, { align: "left" });

    pdfDoc.end();

    writeStream.on("finish", () => {
      return res.status(200).json({
        message: "PDF notes generated successfully",
        file: `/notes/${safeId}.pdf`,
        cached: false,
      });
    });
  } catch (error) {
    console.error("Error generating notes:", error);
    return res.status(500).json({
      message: "Failed to generate notes",
      error: error.message,
    });
  }
});
function sanitizeFilename(name) {
  return name
    .replace(/[\\/:*?"<>|]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Convert spaces to hyphens
    .trim()
    .toLowerCase();
}

// ✅ Helper: Capitalize title
function titleCase(str) {
  return String(str)
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

courseRouter.post("/update-progress", async (req, res) => {
  try {
    const { videoId, userId, courseId } = req.body;

    if (!videoId || !userId || !courseId) {
      return res.status(400).json({
        message: "videoId, userId and courseId are required",
      });
    }

    // ✅ Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Find the specific course inside enrolledCourses
    const enrolledCourse = user.enrolledCourses.find(
      (c) => c.course.toString() === courseId
    );

    user.enrolledCourses.forEach((element) => {
      if (element.course.toString() === courseId) {
        element.progress[videoId - 1] = true;
      }
    });

    // ✅ Mark course completed if all videos done
    enrolledCourse.isComplete = enrolledCourse.progress.every(
      (p) => p === true
    );

    // ✅ Save user
    await user.save();

    return res.status(200).json({
      message: "Progress updated successfully",
      progress: enrolledCourse.progress,
      isComplete: enrolledCourse.isComplete,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ✅ Get transcript (official captions → fallback to AssemblyAI → cached)
courseRouter.post("/get-transcript", async (req, res) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) return res.status(400).json({ error: "Video URL required" });

    console.log("[LOG] Received videoUrl:", videoUrl);

    const videoId = extractYouTubeId(videoUrl);
    const transcriptPath = path.join(transcriptDir, `${videoId}.txt`);

    // 1️⃣ Cached transcript
    if (fs.existsSync(transcriptPath)) {
      console.log("[CACHE HIT] Returning saved transcript:", transcriptPath);
      const cachedText = fs.readFileSync(transcriptPath, "utf8");
      return res.json({ text: cachedText, cached: true });
    }

    // 2️⃣ Try official captions
    try {
      console.log("[LOG] Attempting to fetch official captions...");
      const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
      if (transcript?.length > 0) {
        const plainText = transcript.map((t) => t.text).join(" ");
        fs.writeFileSync(transcriptPath, plainText);
        console.log("[CACHE SAVE] Saved official captions to:", transcriptPath);
        return res.json({ text: plainText, cached: false });
      }
      console.log("[LOG] No official captions found.");
    } catch (err) {
      console.log("[LOG] Falling back to AssemblyAI.");
    }

    // 3️⃣ Download audio
    const tempFile = path.join(process.cwd(), "temp_audio.wav");
    console.log("[LOG] Downloading audio to:", tempFile);
    await downloadAudio(videoUrl, tempFile);

    // 4️⃣ Upload to AssemblyAI
    console.log("[LOG] Uploading audio to AssemblyAI...");
    const uploadUrl = await uploadToAssemblyAI(tempFile);

    // 5️⃣ Start transcription
    console.log("[LOG] Starting transcription job...");
    const transcriptText = await transcribeWithAssemblyAI(uploadUrl);

    fs.unlinkSync(tempFile); // cleanup
    fs.writeFileSync(transcriptPath, transcriptText); // cache it
    console.log("[CACHE SAVE] Saved AssemblyAI transcript:", transcriptPath);

    return res.json({ text: transcriptText, cached: false });
  } catch (err) {
    console.error("[ERROR] Transcript fetch error:", err);
    res.status(500).json({
      error: "Failed to fetch transcript",
      details: err.message || err,
    });
  }
});

courseRouter.post("/rate/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Invalid rating" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Average rating (simple incremental average)
    course.ratingCount = (course.ratingCount || 0) + 1;
    course.totalRating = (course.totalRating || 0) + rating;
    course.rating = Number(
      (course.totalRating / course.ratingCount).toFixed(1)
    );

    await course.save();

    res.status(200).json({
      message: "Rating added successfully",
      newRating: course.rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Filter by category
courseRouter.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const courses = await CourseModel.find({ courseType: category });
    if (courses.length > 0) {
      res.status(200).json({ success: true, courses });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No courses found in this category" });
    }
  } catch (err) {
    console.error("Error fetching category courses:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default courseRouter;

// ---------------- Helper Functions ----------------

const ASSEMBLYAI_KEY = process.env.ASSEMBLYAI_API_KEY;

// Extract YouTube video ID safely
function extractYouTubeId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?].*)?$/);
  return match ? match[1] : Buffer.from(url).toString("base64");
}

// Upload audio file to AssemblyAI
async function uploadToAssemblyAI(filePath) {
  const audioBuffer = fs.readFileSync(filePath);
  const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: { authorization: ASSEMBLYAI_KEY },
    body: audioBuffer,
  });
  
  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`AssemblyAI upload failed: ${uploadRes.status} - ${errorText}`);
  }
  
  const uploadData = await uploadRes.json();
  return uploadData.upload_url;
}

// Submit transcription job and wait for completion
async function transcribeWithAssemblyAI(uploadUrl) {
  const res = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      authorization: ASSEMBLYAI_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({ audio_url: uploadUrl }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`AssemblyAI transcription job creation failed: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  const transcriptId = data.id;

  // Poll until transcription is done
  while (true) {
    const statusRes = await fetch(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      { headers: { authorization: ASSEMBLYAI_KEY } }
    );
    const statusData = await statusRes.json();

    if (statusData.status === "completed") return statusData.text;
    if (statusData.status === "error") throw new Error(statusData.error);

    console.log("[LOG] Transcription in progress...");
    await new Promise((r) => setTimeout(r, 5000));
  }
}
