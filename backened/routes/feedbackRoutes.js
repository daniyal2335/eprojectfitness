import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// Submit feedback
router.post("/", verifyToken, asyncHandler(async (req, res) => {
  const feedback = new Feedback({
    user: req.user.id,
    message: req.body.message,
  });
  await feedback.save();
  res.json({ message: "Feedback submitted successfully" });
}));

export default router;
