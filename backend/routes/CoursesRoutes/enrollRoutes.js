// backend/routes/CoursesRoutes/enrollRoutes.js
import express from "express";
import { enrollInCourse } from "../../controllers/courses/courceEnroll.js";

const enrollRoutes = express.Router();

// POST /api/enroll
enrollRoutes.post("/enroll", enrollInCourse);

export default enrollRoutes;
