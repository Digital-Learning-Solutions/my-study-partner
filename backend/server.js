import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Your existing routes
import apiRouter from "./routes/QuizRoutes/api.js";
import sockets from "./sockets.js";
import courseRouter from "./routes/CoursesRoutes/course.js";
import authRoutes from "./routes/UserRoutes/authRoutes.js";
import userRoutes from "./routes/UserRoutes/userRoutes.js";
import dashboardRoutes from "./routes/UserRoutes/dashboardRoutes.js";
import discussionRoutes from "./routes/DiscussionRoutes/discussionRoutes.js";

// 👉 NEW QUIZ-GROUP ROUTES

import connectDB from "./config/database.js";
import quizGroupRouter from "./routes/QuizRoutes/quizGroupRouter.js";
import chatRouter from "./routes/chat.js";

dotenv.config();

// DB connect
connectDB();

const app = express();
const server = http.createServer(app);

// SOCKET.IO instance
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// attach io to app (important!)
app.set("io", io);

// middleware
app.use(cors());
app.use(express.json());
app.use("/notes", express.static(path.join(process.cwd(), "notes")));

// routes
app.use("/api", apiRouter);
app.use("/api/chat", chatRouter);
app.use("/api/quiz-groups", quizGroupRouter);
app.use("/api/course", courseRouter);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/discussions", discussionRoutes);

// 👉 QUIZ GROUP ROUTES

// initialize your previous sockets
sockets(io);

// 👉 **NEW SOCKETS FOR QUIZ GROUP GAME SYSTEM**
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  // user joins a room with their userId →
  // so backend can emit directly using io.to(userId)
  socket.on("register-user", (userId) => {
    socket.join(userId);
  });

  // join quiz-group room
  socket.on("join-quiz-group", (groupId) => {
    socket.join(groupId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
