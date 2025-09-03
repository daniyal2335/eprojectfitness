import mongoose from 'mongoose';
const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weight: Number, 
  bodyFat: Number, 
  chest: Number,
  waist: Number,
  hips: Number,
  arms: Number,
  thighs: Number,
  runTime: Number, 
  liftMax: Number,
  recordedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Progress', ProgressSchema);
