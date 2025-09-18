import mongoose from 'mongoose';
const ExerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
  weight: Number,
  notes: String,
});
const WorkoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  title: String,
  category: { type:String, enum:['strength','cardio','mobility','other'], default:'strength' },
     tags: [{ type: String }],  
  exercises: [ExerciseSchema],
  duration: Number, // minutes
  calories: Number,
  performedAt: { type:Date, default: Date.now }
},{ timestamps:true });
export default mongoose.model('Workout', WorkoutSchema);
