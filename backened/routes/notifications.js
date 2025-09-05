import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ✅ Get only unread notifications
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const list = await Notification.find({
      user: req.user.id,
      read: false,
    }).sort({ createdAt: -1 });

    console.log("📥 Fetching unread notifications for:", req.user.id, list.length);

    res.json(list);
  })
);

// ✅ Mark as read
router.post(
  "/mark-read/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    console.log("✅ Marked as read:", updated?._id);

    res.json({ message: "ok" });
  })
);

// ✅ Create + emit helper
async function emitNotification(req, message) {
  const notif = await Notification.create({
    user: req.user.id,
    message,
    read: false,
  });

  // convert userId to string for socket room
  const io = req.app.get("io");
  const roomId = req.user.id.toString();

  console.log("📤 Emitting notification to room:", roomId, notif.message);

  // force notif.user into string for frontend comparison
  const payload = {
    ...notif.toObject(),
    user: notif.user.toString(),
  };

  io.to(roomId).emit("notification", payload);

  return notif;
}

// ✅ Manual notification endpoint
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const notif = await emitNotification(req, req.body.message);
    res.status(201).json(notif);
  })
);

export { emitNotification };
export default router;
