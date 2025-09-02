import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import Progress from '../models/Progress.js';

const router = express.Router();

router.get('/stats', verifyToken, asyncHandler(async (req,res)=>{
  const workouts = await Workout.find({ user:req.user.id });
  const totalWorkouts = workouts.length;
  const caloriesBurned = workouts.reduce((s,w)=> s+(w.calories||0), 0);
  const hoursTrained = workouts.reduce((s,w)=> s+((w.duration||0)/60), 0);
  res.json({ totalWorkouts, caloriesBurned, hoursTrained });
}));

router.get('/weekly-workouts', verifyToken, asyncHandler(async (req,res)=>{
  const from = new Date(); from.setDate(from.getDate()-7);
  const weekly = await Workout.find({ user:req.user.id, performedAt:{ $gte:from } }).sort({ performedAt:1 });
  res.json(weekly);
}));

router.get('/weight-progress', verifyToken, asyncHandler(async (req,res)=>{
  const weight = await Progress.find({ user:req.user.id }).sort({ recordedAt:1 }).select('recordedAt weight -_id');
  res.json(weight);
}));

router.get('/recent', verifyToken, asyncHandler(async (req,res)=>{
  const recentWorkouts = await Workout.find({ user:req.user.id }).sort({ performedAt:-1 }).limit(5);
  const recentMeals = await Nutrition.find({ user:req.user.id }).sort({ date:-1 }).limit(5);
  const latestProgress = await Progress.find({ user:req.user.id }).sort({ recordedAt:-1 }).limit(1);
  res.json({ recentWorkouts, recentMeals, latestProgress: latestProgress[0] || null });
}));

export default router;
