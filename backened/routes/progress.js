import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Progress from '../models/Progress.js';

const router = express.Router();

router.get('/', verifyToken, asyncHandler(async (req,res)=>{
  const list = await Progress.find({ user:req.user.id }).sort({ recordedAt:1 });
  res.json(list);
}));

router.post('/', verifyToken, asyncHandler(async (req,res)=>{
  const created = await Progress.create({ ...req.body, user:req.user.id });
  res.status(201).json(created);
}));

export default router;
