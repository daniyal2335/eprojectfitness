import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    // ✅ Required category field
    category: {
      type: String,
      required: true,
      enum: [
        "general-discussion",
        "workout-tips",
        "nutrition-advice",
        "progress-sharing",
        "motivation",
        "questions",
        "success-stories",
        "equipment-reviews",
      ],
    },

    // ✅ Optional tags
    tags: [{ type: String }],

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [
      {
        content: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ForumPost", forumPostSchema);
