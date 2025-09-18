import express from "express";
import verifyToken from "../utils/verifyToken.js";
import Progress from "../models/Progress.js";

const router = express.Router();

// ✅ Get all progress for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).sort({ recordedAt: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// ✅ Create new progress
router.post("/", verifyToken, async (req, res) => {
  try {
    const progress = new Progress({
      ...req.body,
      user: req.user.id,
    });
    await progress.save();

    // socket emit
    const io = req.app.get("io");
    io.to(req.user.id).emit("progress_created", {
      message: "Progress entry created",
      progress,
    });

    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to create progress" });
  }
});

// ✅ Update progress
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!progress) return res.status(404).json({ error: "Progress not found" });

    const io = req.app.get("io");
    io.to(req.user.id).emit("progress_updated", {
      message: "Progress entry updated",
      progress,
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// ✅ Delete progress
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!progress) return res.status(404).json({ error: "Progress not found" });

    const io = req.app.get("io");
    io.to(req.user.id).emit("progress_deleted", {
      message: "Progress entry deleted",
      id: req.params.id,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete progress" });
  }
});

export default router;
