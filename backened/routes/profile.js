import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';

const router = express.Router();
// ✅ Get logged-in user's profile
router.get('/me', verifyToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage || null,
    preferences: user.preferences || {}
  });
}));

// ✅ Update logged-in user's profile
router.put('/update', verifyToken, asyncHandler(async (req, res) => {
  const fields = ['name', 'username', 'email', 'profileImage', 'preferences'];
  const update = {};

  fields.forEach(f => {
    if (req.body[f] !== undefined) update[f] = req.body[f];
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    update,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ message: 'Profile updated', user });
}));

export default router;
