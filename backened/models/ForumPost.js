import mongoose from "mongoose";

const { Schema, model } = mongoose;

const replySchema = new Schema({
  content: { type: String, required: true, trim: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const forumPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    category: {
      type: String,
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
      required: true,
    },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [replySchema],
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },

    // ✅ Forum follow system
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// 🔹 Virtual fields (calculated, not stored in DB)
forumPostSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

forumPostSchema.virtual("repliesCount").get(function () {
  return this.replies.length;
});

forumPostSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});

// 🔹 Auto-populate author + reply authors when finding posts
function autoPopulate(next) {
  this.populate("author", "username email profilePicture name.firstName name.lastName")
      .populate("replies.author", "username email profilePicture name.firstName name.lastName");
  next();
}

forumPostSchema.pre("find", autoPopulate);
forumPostSchema.pre("findOne", autoPopulate);

export default model("ForumPost", forumPostSchema);
