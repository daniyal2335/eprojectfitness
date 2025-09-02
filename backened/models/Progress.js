import mongoose from 'mongoose';
const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  recordedAt: { type:Date, default: Date.now },
  weight: Number, // kg
  bodyFat: Number, // %
  chest: Number, waist: Number, hips: Number, arms: Number, thighs: Number, // cm
  run5kTime: Number, // seconds
  squat1RM: Number, bench1RM: Number, deadlift1RM: Number
},{ timestamps:true });
export default mongoose.model('Progress', ProgressSchema);
