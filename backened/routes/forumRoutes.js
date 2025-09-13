import express from "express";
import { body, param, query } from "express-validator";
import verifyToken from "../utils/verifyToken.js";
import { errorHandler, handleValidationErrors, logActivity } from "../middleware/errorHandler.js";
import { sendNotification } from "../utils/sendNotification.js";
import ForumPost from "../models/ForumPost.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken); 

// ================== GET ALL POSTS ==================
router.get(
  "/",
  [
    query("category").optional().isIn([
      "general-discussion","workout-tips","nutrition-advice","progress-sharing",
      "motivation","questions","success-stories","equipment-reviews",
    ]),
    query("tags").optional().isString(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("sort").optional().isIn(["latest","popular","trending"]),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { category, tags, page = 1, limit = 20, sort = "latest" } = req.query;
      const skip = (page - 1) * limit;

      const queryObj = {};
      if (category) queryObj.category = category;
      if (tags) queryObj.tags = { $in: tags.split(",") };

      let sortOption = {};
      switch (sort) {
        case "popular": sortOption = { likesCount: -1, createdAt: -1 }; break;
        case "trending": sortOption = { views: -1, createdAt: -1 }; break;
        default: sortOption = { isPinned: -1, createdAt: -1 };
      }

      const posts = await ForumPost.find(queryObj)
        .populate("author", "username name.firstName name.lastName profilePicture")
        .populate("replies.author", "username name.firstName name.lastName profilePicture")
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await ForumPost.countDocuments(queryObj);

      const postsWithStatus = posts.map(post => ({
        ...post.toObject(),
        isLiked: post.likes.some(like => like.user.toString() === req.user._id.toString()),
        likesCount: post.likes.length,
        repliesCount: post.replies.length,
      }));

      res.json({
        posts: postsWithStatus,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum posts", details: error.message });
    }
  }
);

// ================== GET SINGLE POST ==================
router.get("/:id", [param("id").isMongoId(), handleValidationErrors], async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate("author", "username name.firstName name.lastName profilePicture")
      .populate("replies.author", "username name.firstName name.lastName profilePicture");

    if (!post) return res.status(404).json({ error: "Forum post not found" });

    post.views += 1;
    await post.save();

    res.json({
      ...post.toObject(),
      isLiked: post.likes.some(like => like.user.toString() === req.user._id.toString()),
      likesCount: post.likes.length,
      repliesCount: post.replies.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post", details: error.message });
  }
});

// ================== CREATE POST ==================
router.post(
  "/",
  [
    body("title").isString().trim().isLength({ min: 1, max: 200 }),
    body("content").isString().trim().isLength({ min: 1, max: 5000 }),
    body("category").isIn([
      "general-discussion","workout-tips","nutrition-advice","progress-sharing",
      "motivation","questions","success-stories","equipment-reviews",
    ]),
    body("tags").optional().isArray(),
    handleValidationErrors,
  ],
  logActivity("forum-post-created", "Created a forum post"),
  async (req, res) => {
    try {
      const post = new ForumPost({ ...req.body, author: req.user._id });
      await post.save();
      await post.populate("author", "username name.firstName name.lastName profilePicture");
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post", details: error.message });
    }
  }
);



// Reply to post
router.post(
  "/:id/reply",
  [param("id").isMongoId(), body("content").isString().trim().isLength({ min: 1 }), handleValidationErrors],
  async (req, res) => {
    try {
      const post = await ForumPost.findById(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const newReply = {
        content: req.body.content,
        author: req.user._id,
        createdAt: new Date(),
      };

      post.replies.push(newReply);
      await post.save();

      // Populate author info before sending back
      const populatedPost = await post.populate("replies.author", "username name.firstName name.lastName profilePicture");

      // Return only the latest reply
      res.status(201).json(populatedPost.replies[populatedPost.replies.length - 1]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add reply", details: err.message });
    }
  }
);
/**
 * LIKE OR UNLIKE POST
 */
router.post("/:id/like", async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user._id.toString();
    const likedIndex = post.likes.findIndex((l) => l.user.toString() === userId);

    if (likedIndex >= 0) {
      // unlike
      post.likes.splice(likedIndex, 1);
    } else {
      // like
      post.likes.push({ user: req.user._id });
    }

    await post.save();

    // Return only what's needed
    res.json({
      isLiked: likedIndex === -1, // true if just liked
      likesCount: post.likes.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to like post", details: err.message });
  }
});


export default router;
