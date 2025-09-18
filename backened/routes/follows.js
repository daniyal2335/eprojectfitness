import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import verifyToken from "../routes/auth.js";
import ForumPost from "../models/ForumPost.js";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Follow forum
router.post("/:id/follow", verifyToken, asyncHandler(async (req, res) => {
  const forumId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(forumId)) {
    return res.status(400).json({ error: "Invalid forum ID" });
  }

  if (!req.user?.id) return res.status(401).json({ error: "Invalid token" });

  const forum = await ForumPost.findById(forumId);
  if (!forum) return res.status(404).json({ error: "Forum not found" });

  forum.followers = forum.followers || [];

  if (!forum.followers.some(f => f.toString() === req.user.id)) {
    forum.followers.push(req.user.id);
  }

  // ✅ Save without triggering validation errors for missing author/reply.author
  try {
    await forum.save({ validateBeforeSave: false });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    return res.status(500).json({ error: "Failed to follow forum" });
  }

  res.json({
    success: true,
    followersCount: forum.followers.length,
    isFollowed: forum.followers.some(f => f.toString() === req.user.id)
  });
}));

// ✅ Unfollow forum
router.delete("/:id/follow", verifyToken, asyncHandler(async (req, res) => {
  const forumId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(forumId)) {
    return res.status(400).json({ error: "Invalid forum ID" });
  }

  if (!req.user?.id) return res.status(401).json({ error: "Invalid token" });

  const forum = await ForumPost.findById(forumId);
  if (!forum) return res.status(404).json({ error: "Forum not found" });

  forum.followers = forum.followers || [];

  forum.followers = forum.followers.filter(f => f.toString() !== req.user.id);

  try {
    await forum.save({ validateBeforeSave: false });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    return res.status(500).json({ error: "Failed to unfollow forum" });
  }

  res.json({
    success: true,
    followersCount: forum.followers.length,
    isFollowed: false
  });
}));

// ✅ Get forum followers
router.get("/:id/followers", asyncHandler(async (req, res) => {
  const forumId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(forumId)) {
    return res.status(400).json({ error: "Invalid forum ID" });
  }

  const forum = await ForumPost.findById(forumId)
    .populate("followers", "name username profileImage");

  if (!forum) return res.status(404).json({ error: "Forum not found" });

  res.json(forum.followers);
}));

export default router;
