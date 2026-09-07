import express from "express";

import { getLessonById, markLessonComplete,} from "../controllers/lessonController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:lessonId",protect,getLessonById);

router.post( "/:lessonId/complete",protect,markLessonComplete);

export default router;