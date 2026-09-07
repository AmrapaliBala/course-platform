import express from "express";

import {getCourses,getCourseById,} from "../controllers/courseController.js";

import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCourses);

router.get("/:id",optionalAuth, getCourseById);

export default router;