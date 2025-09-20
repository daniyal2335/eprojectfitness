import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  units: { type: String, enum: ["metric", "imperial"], default: "metric" },
  notifications: { type: Boolean, default: true },
});

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
