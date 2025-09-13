import { validationResult } from "express-validator";

// 1️⃣ Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("ERR:", err);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
};

// 2️⃣ Validation errors handler for express-validator
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 3️⃣ Log activity helper (for forum or other events)
export const logActivity = (event, description) => {
  return (req, res, next) => {
    try {
      console.log(`🔹 Activity: ${event} | ${description} | User: ${req.user?._id}`);
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
    next();
  };
};
