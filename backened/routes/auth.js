import express from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import multer from 'multer';

const router = express.Router();
const upload = multer(); // memory storage

router.post(
  "/register",
  upload.single("profileImage"),
  asyncHandler(async (req, res) => {
    const { username, email, password, name } = req.body;
    const profileImage = req.file ? req.file.buffer.toString("base64") : null;

    // check duplicate
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      name,
      profileImage,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  })
);
router.post('/login', asyncHandler(async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ message:'User not found' });

  const match = await user.comparePassword(password);
  if(!match) return res.status(401).json({ message:'Invalid credentials' });

  const token = jwt.sign(
    { id:user._id, username:user.username, email:user.email },
    process.env.JWT_SECRET,
    { expiresIn:'7d' }
  );

  res.json({ token, user, message: "Login successful" });
}));


export default router;
