import express from "express";

import { requestOtp, verifyOtp, getMe,} from "../controllers/authController.js";

import { protect,} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request-otp",requestOtp);

router.post( "/verify-otp", verifyOtp);

router.get("/me",protect,getMe);

export default router;