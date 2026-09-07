import express from "express";

import {enrollInCourse,getMyCourses,} from "../controllers/enrollmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, enrollInCourse);

router.get("/my-courses", protect, getMyCourses);

export default router;