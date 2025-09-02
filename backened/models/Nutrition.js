import mongoose from 'mongoose';
const FoodItemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  unit: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
});
const NutritionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  date: { type:Date, default: Date.now },
  mealType: { type:String, enum:['breakfast','lunch','dinner','snacks'], required:true },
  items: [FoodItemSchema],
  totalCalories: Number,
  totals: { protein:Number, carbs:Number, fats:Number }
},{ timestamps:true });
export default mongoose.model('Nutrition', NutritionSchema);
