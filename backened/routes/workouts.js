import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Workout from '../models/Workout.js';

const router = express.Router();

router.get('/', verifyToken, asyncHandler(async (req,res)=>{
  const { q, category, tag } = req.query;
  const filter = { user: req.user.id };
  if(category) filter.category = category;
  if(tag) filter.tags = tag;
  if(q) filter.$text = { $search: q };
  const list = await Workout.find(filter).sort({ performedAt: -1 });
  res.json(list);
}));

router.post('/', verifyToken, asyncHandler(async (req,res)=>{
  const created = await Workout.create({ ...req.body, user: req.user.id });
  res.status(201).json(created);
}));

router.put('/:id', verifyToken, asyncHandler(async (req,res)=>{
  const updated = await Workout.findOneAndUpdate({ _id:req.params.id, user:req.user.id }, req.body, { new:true });
  if(!updated) return res.status(404).json({message:'Not found'});
  res.json(updated);
}));

router.delete('/:id', verifyToken, asyncHandler(async (req,res)=>{
  const del = await Workout.findOneAndDelete({ _id:req.params.id, user:req.user.id });
  if(!del) return res.status(404).json({message:'Not found'});
  res.json({ message:'Deleted' });
}));

export default router;
