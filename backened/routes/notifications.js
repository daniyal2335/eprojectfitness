import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/Notification.js";

const router = express.Router();

/**
 * 🔹 Helper: Emit notification via socket.io
 */
export async function emitNotification(req, { user, message, type = "info" }) {
  const notif = await Notification.create({
    user,
    message,
    type,
    read: false,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(user.toString()).emit("notification", {
      ...notif.toObject(),
      user: notif.user.toString(),
    });
  }

  return notif;
}

/**
 * 🔹 Get notifications
 * query: ?unread=true to fetch only unread
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

    res.json(list);
  })
);

/**
 * 🔹 Mark a single notification as read
 */
router.patch(
  "/:id/read",
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

    res.json({ message: "ok", notification: updated });
  })
);

/**
 * 🔹 Mark all notifications as read
 */
router.patch(
  "/read-all",
  verifyToken,
  asyncHandler(async (req, res) => {
    const result = await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: "ok", modified: result.modifiedCount });
  })
);

/**
 * 🔹 Create a manual notification (API trigger)
 */
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { message, type = "info" } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const notif = await emitNotification(req, {
      user: req.user.id,
      message,
      type,
    });

    res.status(201).json(notif);
  })
);

/**
 * 🔹 Test notification (for debugging)
 */
router.post(
  "/test",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { message = "Test Notification" } = req.body;

    const notif = await emitNotification(req, {
      user: req.user.id,
      message,
      type: "info",
    });

    res.json({ success: true, notif });
  })
);

export default router;
