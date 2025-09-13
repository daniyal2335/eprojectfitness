import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/Notification.js";

const router = express.Router();

/**
 * 🔹 Get notifications
 * query: ?unread=true to get only unread
 */
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { unread } = req.query;

    const filter = { user: req.user.id };
    if (unread === "true") filter.read = false;

    const list = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(
      `📥 Fetching ${unread ? "unread" : "all"} notifications for:`,
      req.user.id,
      list.length
    );

    res.json(list);
  })
);

/**
 * 🔹 Mark single notification as read
 */
router.post(
  "/mark-read/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    console.log("✅ Marked as read:", updated._id);
    res.json({ message: "ok" });
  })
);

/**
 * 🔹 Mark all as read
 */
router.post(
  "/mark-read-all",
  verifyToken,
  asyncHandler(async (req, res) => {
    const result = await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    console.log("✅ Marked all as read for:", req.user.id);
    res.json({ message: "ok", modified: result.modifiedCount });
  })
);

/**
 * 🔹 Create + emit notification
 */
// routes/notifications.js
async function emitNotification(req, message, type = "info") {
  const notif = await Notification.create({
    user: req.user.id,
    message,
    type,
    read: false,
  });

  const io = req.app.get("io");
  io.to(req.user.id.toString()).emit("notification", {
    ...notif.toObject(),
    user: notif.user.toString(),
  });

  return notif;
}

// Manual endpoint
router.post("/", verifyToken, asyncHandler(async (req, res) => {
  const { message, type } = req.body;
  if (!message) return res.status(400).json({ message: "Message required" });

  const notif = await emitNotification(req, message, type || "info");
  res.status(201).json(notif);
}));


export { emitNotification };
export default router;
