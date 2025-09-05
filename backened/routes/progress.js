import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Progress from "../models/Progress.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// 🔹 Helper: create + emit notification
const emitNotification = async (req, message) => {
  const notif = await Notification.create({
    user: req.user.id,
    message,
    read: false,
  });

  const io = req.app.get("io");
  console.log("📤 Emitting notification to room:", req.user.id, message);

  io.to(req.user.id.toString()).emit("notification", {
    ...notif.toObject(),
    user: notif.user.toString(),
  });

  return notif;
};

// ✅ Get all progress records
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const list = await Progress.find({ user: req.user.id }).sort({ recordedAt: -1 });
    res.json(list);
  })
);

// ✅ Get single record
router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const record = await Progress.findOne({ _id: req.params.id, user: req.user.id });
    if (!record) return res.status(404).json({ message: "Progress record not found" });
    res.json(record);
  })
);

// ✅ Create record
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const created = await Progress.create({ ...req.body, user: req.user.id });
    await emitNotification(req, `New progress record added!`);
    res.status(201).json(created);
  })
);

// ✅ Update record
router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const updated = await Progress.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Progress record not found" });

    await emitNotification(req, `Progress record updated!`);
    res.json(updated);
  })
);

// ✅ Delete record
router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const deleted = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Progress record not found" });

    await emitNotification(req, `Progress record deleted!`);
    res.json({ message: "Deleted successfully" });
  })
);

export default router;
