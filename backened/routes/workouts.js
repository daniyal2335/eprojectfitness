import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Workout from '../models/Workout.js';
import Notification from '../models/Notification.js';

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

// ✅ Get all workouts
router.get('/', verifyToken, asyncHandler(async (req,res)=>{
  const { q, category, tag } = req.query;
  const filter = { user: req.user.id };
  if(category) filter.category = category;
  if(tag) filter.tags = tag;
  if(q) filter.$text = { $search: q };

  const list = await Workout.find(filter).sort({ performedAt: -1 });
  res.json(list);
}));

// ✅ Get single workout
router.get('/:id', verifyToken, asyncHandler(async (req,res)=>{
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id });
  if(!workout) return res.status(404).json({ message: 'Workout not found' });
  res.json(workout);
}));

// ✅ Create new workout + notification
router.post('/', verifyToken, asyncHandler(async (req,res)=>{
  const created = await Workout.create({ ...req.body, user: req.user.id });

  // ✅ emit notification
  await emitNotification(req, `Workout "${created.title || "Untitled"}" created!`);

  res.status(201).json(created);
}));

// ✅ Update workout + notification
router.put('/:id', verifyToken, asyncHandler(async (req,res)=>{
  const updated = await Workout.findOneAndUpdate(
    { _id:req.params.id, user:req.user.id },
    req.body,
    { new:true }
  );
  if(!updated) return res.status(404).json({ message:'Workout not found' });

  // ✅ emit notification
  await emitNotification(req, `Workout "${updated.title || "Untitled"}" updated!`);

  res.json(updated);
}));

// ✅ Delete workout + notification
router.delete('/:id', verifyToken, asyncHandler(async (req,res)=>{
  const del = await Workout.findOneAndDelete({ _id:req.params.id, user:req.user.id });
  if(!del) return res.status(404).json({ message:'Workout not found' });

  // ✅ emit notification
  await emitNotification(req, `Workout "${del.title || "Untitled"}" deleted!`);

  res.json({ message:'Deleted' });
}));

export default router;
