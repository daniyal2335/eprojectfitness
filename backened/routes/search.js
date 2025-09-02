import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', verifyToken, asyncHandler(async (req,res)=>{
  const { q='' } = req.query;
  const userId = req.user.id;
  const regex = new RegExp(q, 'i');

  const [workouts, meals, users] = await Promise.all([
    Workout.find({ user:userId, $or:[ {title:regex}, {tags:regex}, {'exercises.name':regex} ] }).limit(10),
    Nutrition.find({ user:userId, $or:[ {mealType:regex}, {'items.name':regex} ] }).limit(10),
    User.find({ username: regex }).select('username name profileImage').limit(10)
  ]);

  res.json({ workouts, meals, users });
}));

export default router;
