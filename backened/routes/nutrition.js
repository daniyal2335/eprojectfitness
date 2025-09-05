import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Nutrition from "../models/Nutrition.js";
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

/**
 * @desc   Get single nutrition log by ID
 * @route  GET /api/nutrition/:id
 * @access Private
 */
router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const log = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!log) {
      return res.status(404).json({ message: "Nutrition log not found" });
    }

    res.json(log);
  })
);

/**
 * @desc   Get nutrition logs (optionally filter by date)
 * @route  GET /api/nutrition
 * @access Private
 */
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { date } = req.query;
    const filter = { user: req.user.id };

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const logs = await Nutrition.find(filter).sort({ date: -1 });
    res.json(logs);
  })
);

/**
 * @desc   Create new nutrition log
 * @route  POST /api/nutrition
 * @access Private
 */
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const payload = { ...req.body, user: req.user.id };

    if (!Array.isArray(payload.items)) {
      payload.items = [];
    }

    const totals = payload.items.reduce(
      (acc, item) => ({
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbs || 0),
        fats: acc.fats + (item.fats || 0),
        calories: acc.calories + (item.calories || 0),
      }),
      { protein: 0, carbs: 0, fats: 0, calories: 0 }
    );

    payload.totalCalories = totals.calories;
    payload.totals = {
      protein: totals.protein,
      carbs: totals.carbs,
      fats: totals.fats,
    };

    const log = await Nutrition.create(payload);

    // ✅ send notification
    await emitNotification(req, `New nutrition log "${log.name || "Untitled"}" added.`);

    res.status(201).json(log);
  })
);

/**
 * @desc   Update nutrition log
 * @route  PUT /api/nutrition/:id
 * @access Private
 */
router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const updated = await Nutrition.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Nutrition log not found" });
    }

    // ✅ send notification
    await emitNotification(req, `Nutrition log "${updated.name || "Untitled"}" updated.`);

    res.json(updated);
  })
);

/**
 * @desc   Delete nutrition log
 * @route  DELETE /api/nutrition/:id
 * @access Private
 */
router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const deleted = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Nutrition log not found" });
    }

    // ✅ send notification
    await emitNotification(req, `Nutrition log "${deleted.name || "Untitled"}" deleted.`);

    res.json({ message: "Deleted successfully" });
  })
);

export default router;
