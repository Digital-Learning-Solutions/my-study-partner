import ytdlp from "yt-dlp-exec";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";

export async function downloadAudio(videoUrl, outputFile) {
  try {
    const tempDir = path.dirname(outputFile);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    await ytdlp(videoUrl, {
      extractAudio: true,
      audioFormat: "wav",
      output: outputFile,
      ffmpegLocation: ffmpegInstaller.path,
    });

    return outputFile;
  } catch (err) {
    console.error("[ERROR] Audio download failed:", err.message);
    throw err;
  }
}
