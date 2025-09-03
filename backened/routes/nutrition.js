import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Nutrition from "../models/Nutrition.js";

const router = express.Router();
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

    // Ensure items is an array
    if (!Array.isArray(payload.items)) {
      payload.items = [];
    }

    // Calculate totals
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

    res.json({ message: "Deleted successfully" });
  })
);

export default router;
