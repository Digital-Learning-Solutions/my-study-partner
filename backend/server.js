import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/QuizRoutes/api.js";
import sockets from "./sockets.js";
import courseRouter from "./routes/CoursesRoutes/course.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use("/course", courseRouter);

// connect to MongoDB if provided (optional)
// if (process.env.MONGO_URI) {
//   mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('Mongo connect error', err.message));
// }

// initialize sockets
sockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
