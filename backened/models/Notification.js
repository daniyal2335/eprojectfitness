import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // receiver
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // actor
    type: {
      type: String,
      enum: ["like", "reply", "follow", "goal", "workout"],
      required: true,
    },
    message: { type: String, required: true },
    link: { type: String }, // e.g. /forum/123
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
