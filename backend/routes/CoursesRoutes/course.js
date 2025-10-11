import express from "express";
import CourseModel from "../../models/CourseModel/Course.js"; // your mongoose model
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { YoutubeTranscript } from "youtube-transcript";
import { downloadAudio } from "./audio_download.js";
import Course from "../../models/CourseModel/Course.js";
import { rateCourse } from "../../controllers/courses/courceEnroll.js";

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
