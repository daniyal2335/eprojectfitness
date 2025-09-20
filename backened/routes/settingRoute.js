import express from "express";
import verifyToken from "../utils/verifyToken.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Setting from "../models/Setting.js";

const router = express.Router();

// Get user settings
router.get("/", verifyToken, asyncHandler(async (req, res) => {
  const setting = await Setting.findOne({ user: req.user.id });
  res.json(setting || {});
}));

// Update settings
router.put("/", verifyToken, asyncHandler(async (req, res) => {
  const { theme, units, notifications } = req.body;
  let setting = await Setting.findOne({ user: req.user.id });

  if (!setting) {
    setting = new Setting({ user: req.user.id, theme, units, notifications });
  } else {
    setting.theme = theme ?? setting.theme;
    setting.units = units ?? setting.units;
    setting.notifications = notifications ?? setting.notifications;
  }

  await setting.save();
  res.json(setting);
}));

export default router;
