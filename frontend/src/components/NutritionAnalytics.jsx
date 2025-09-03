import { useEffect, useState } from "react";
import { api } from "../api/client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function NutritionAnalytics() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await api("/api/nutrition", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(data);
      } catch (err) {
        console.error(err);
        setError("Could not load nutrition data");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  if (loading) return <p>Loading nutrition data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!meals.length) return <p>No meals logged yet.</p>;

  // ✅ Calculate totals
  const totals = meals.reduce(
    (acc, meal) => {
      meal.items.forEach((item) => {
        acc.calories += item.calories * item.qty;
        acc.protein += item.protein * item.qty;
        acc.carbs += item.carbs * item.qty;
        acc.fats += item.fats * item.qty;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // ✅ Data for Pie Chart (macros distribution)
  const macroData = [
    { name: "Protein", value: totals.protein },
    { name: "Carbs", value: totals.carbs },
    { name: "Fats", value: totals.fats },
  ];
  const COLORS = ["#3b82f6", "#facc15", "#22c55e"];

  // ✅ Daily calories trend (group by date)
  const dailyCalories = meals.reduce((acc, meal) => {
    const date = new Date(meal.createdAt).toLocaleDateString();
    const cals = meal.items.reduce((sum, it) => sum + it.calories * it.qty, 0);
    acc[date] = (acc[date] || 0) + cals;
    return acc;
  }, {});

  const barData = Object.entries(dailyCalories).map(([day, cal]) => ({
    day,
    calories: cal,
  }));

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Nutrition Analytics</h2>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Calories</p>
          <p className="text-xl font-bold">{totals.calories}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Protein</p>
          <p className="text-xl font-bold">{totals.protein} g</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Carbs</p>
          <p className="text-xl font-bold">{totals.carbs} g</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Fats</p>
          <p className="text-xl font-bold">{totals.fats} g</p>
        </div>
      </div>

      {/* Macro Pie Chart */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-4">Macronutrient Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={macroData} dataKey="value" nameKey="name" outerRadius={100} label>
              {macroData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Calories Trend */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-4">Daily Calorie Intake</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
