import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.get('/', verifyToken, asyncHandler(async (req,res)=>{
  const list = await Notification.find({ user:req.user.id }).sort({ createdAt:-1 });
  res.json(list);
}));

router.post('/mark-read/:id', verifyToken, asyncHandler(async (req,res)=>{
  await Notification.findOneAndUpdate({ _id:req.params.id, user:req.user.id }, { read:true });
  res.json({message:'ok'});
}));

export default router;
