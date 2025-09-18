import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import { toCSV } from '../utils/exportUtils.js';

const router = express.Router();

// Workouts CSV export
router.get('/workouts.csv', verifyToken, asyncHandler(async (req, res) => {
  const data = await Workout.find({ user: req.user.id }).lean();
  const csv = toCSV(data);

  res.header('Content-Type', 'text/csv');
  res.attachment('workouts.csv');
  res.send(csv);
}));

// Nutrition CSV export
router.get('/nutrition.csv', verifyToken, asyncHandler(async (req, res) => {
  const data = await Nutrition.find({ user: req.user.id }).lean();
  const csv = toCSV(data);

  res.header('Content-Type', 'text/csv');
  res.attachment('nutrition.csv');
  res.send(csv);
}));

export default router;
