import mongoose from 'mongoose';
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  type: String, // workout_completed, goal_hit, reminder, etc
  message: String,
  read: { type:Boolean, default:false }
},{ timestamps:true });
export default mongoose.model('Notification', NotificationSchema);
