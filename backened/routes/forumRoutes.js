import express from "express";
import mongoose from "mongoose";
import { body, param, query } from "express-validator";
import verifyToken from "../utils/verifyToken.js";
import { errorHandler, handleValidationErrors, logActivity } from "../middleware/errorHandler.js";
import ForumPost from "../models/ForumPost.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ================== GET ALL POSTS ==================
// ================== GET ALL POSTS ==================
// ================== GET ALL POSTS ==================
router.get("/", async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate("author", "username name.firstName name.lastName profilePicture")
      .populate("replies.author", "username name.firstName name.lastName profilePicture")
      .sort({ createdAt: -1 });

    const userId = req.user?._id?.toString();

    const postsWithStatus = posts.map(post => ({
      ...post.toObject(),
      isLiked: userId ? post.likes.some(like => like.toString() === userId) : false,
      isFollowed: userId ? post.followers?.some(f => f.toString() === userId) : false, // ✅ follow state
      likesCount: post.likes.length,
      followersCount: post.followers?.length || 0,
      repliesCount: post.replies.length,
    }));

    res.json({ posts: postsWithStatus, currentUserId: userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


// ================== GET SINGLE POST ==================
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid post ID" });

  try {
    const post = await ForumPost.findById(id)
      .populate("author replies.author");

    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user?._id?.toString();

    res.json({
      ...post.toObject(),
      isLiked: userId ? post.likes.some(like => like.toString() === userId) : false,
      isFollowed: userId ? post.followers?.some(f => f.toString() === userId) : false,
      likesCount: post.likes.length,
      followersCount: post.followers?.length || 0,
      repliesCount: post.replies.length,
      currentUserId: userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

/**
 * @route   POST /api/forum
 * @desc    Create new forum post
 */

router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("REQ.USER in forum:", req.user);

    const { title, content, category, tags } = req.body;

    const post = new ForumPost({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user.id || req.user._id, // ✅ fix
    });

    await post.save();
    await post.populate("author", "username email profilePicture name.firstName name.lastName");

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error("Error creating forum post:", err);
    res.status(500).json({ message: err.message });
  }
});





// ================== REPLY TO POST ==================
router.post(
  "/:id/reply",
  [
    param("id").isMongoId(),
    body("content").isString().trim().isLength({ min: 1 }),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const post = await ForumPost.findById(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const newReply = {
        content: req.body.content,
        author: req.user.id, // ✅ FIX: use req.user.id
        createdAt: new Date(),
      };

      post.replies.push(newReply);
      await post.save();

      const populatedPost = await post.populate(
        "replies.author",
        "username name.firstName name.lastName profilePicture"
      );

      res
        .status(201)
        .json(populatedPost.replies[populatedPost.replies.length - 1]);
    } catch (err) {
      console.error("Reply error:", err);
      res
        .status(500)
        .json({ error: "Failed to add reply", details: err.message });
    }
  }
);

// ================== LIKE/UNLIKE POST ==================
// ================== LIKE/UNLIKE POST ==================
router.post("/:id/like", async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // ✅ Use req.user.id instead of req.user._id
    const userId = req.user.id.toString();

    const likedIndex = post.likes.findIndex(like => like.toString() === userId);

    let isLiked;
    if (likedIndex >= 0) {
      post.likes.splice(likedIndex, 1); // unlike
      isLiked = false;
    } else {
      post.likes.push(req.user.id); // like
      isLiked = true;
    }

    await post.save();

    res.json({
      isLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Failed to like post", details: err.message });
  }
});


export default router;
