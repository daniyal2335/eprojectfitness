import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Get notifications
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const list = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
}));

// Mark as read
router.post('/mark-read/:id', verifyToken, asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { read: true });
  res.json({ message: 'ok' });
}));

// Create notification + emit via socket
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const notif = await Notification.create({
    user: req.user.id,
    message: req.body.message,
    read: false
  });

  const io = req.app.get("io");
  io.to(req.user.id.toString()).emit("notification", notif);

  res.status(201).json(notif);
}));

export default router;
