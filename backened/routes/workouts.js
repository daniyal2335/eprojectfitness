import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Workout from "../models/Workout.js";
import { sendNotification } from "../utils/sendNotification.js";

const router = express.Router();

// ✅ Get all workouts
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { q, category, tag } = req.query;
    const filter = { user: req.user.id };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };

    const list = await Workout.find(filter).sort({ performedAt: -1 });
    res.json(list);
  })
);

// ✅ Get single workout
router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!workout)
      return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  })
);

// ✅ Create new workout
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const workout = await Workout.create({
      ...req.body,
      user: req.user.id,
    });

    await sendNotification(req.app, req.user.id, {
      message: `💪 Workout logged: ${workout.type} (${workout.duration} min)`,
      type: "workout",
      link: `/workouts/${workout._id}`,
    });

    res.status(201).json(workout);
  })
);

// ✅ Update workout
router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const updated = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Workout not found" });

    await sendNotification(req.app, req.user.id, {
      message: `✏️ Workout "${updated.title || updated.type}" updated!`,
      type: "workout",
      link: `/workouts/${updated._id}`,
    });

    res.json(updated);
  })
);

// ✅ Delete workout
router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const del = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!del)
      return res.status(404).json({ message: "Workout not found" });

    await sendNotification(req.app, req.user.id, {
      message: `🗑️ Workout "${del.title || del.type}" deleted!`,
      type: "workout",
    });

    res.json({ message: "Deleted" });
  })
);

export default router;
