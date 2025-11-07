import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

// Import your routes
import apiRouter from "./routes/QuizRoutes/api.js";
import sockets from "./sockets.js";
import courseRouter from "./routes/CoursesRoutes/course.js";
import authRoutes from "./routes/UserRoutes/authRoutes.js";
import connectDB from "./config/database.js";
import enrollRoutes from "./routes/CoursesRoutes/enrollRoutes.js";
import userRoutes from "./routes/UserRoutes/userRoutes.js";
import discussionRoutes from "./routes/DiscussionRoutes/discussionRoutes.js";
import dashboardRoutes from "./routes/UserRoutes/dashboardRoutes.js";

// ✅ Import your DB connection utility

dotenv.config();

// ✅ Connect to MongoDB once globally
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ Global middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api", apiRouter);
app.use("/api/course", courseRouter);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", enrollRoutes);
app.use("/api/discussions", discussionRoutes);

// ✅ Initialize sockets
sockets(io);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
