import { useEffect, useState } from "react";
import { api } from "../api/client";
import NutritionForm from "./NutritionForm";
import NutritionAnalytics from "./NutritionAnalytics";
import { Button } from "./ui/Button";
import toast from "react-hot-toast"; // ✅ toast import

export default function NutritionDashboard() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMeal, setEditMeal] = useState(null);

  // 🔹 Fetch nutrition logs
  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api("/api/nutrition", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // 🔹 Delete log
  const deleteMeal = async (id) => {
    if (!window.confirm("Delete this log?")) return;
    try {
      const token = localStorage.getItem("token");
      await api(`/api/nutrition/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals((s) => s.filter((m) => m._id !== id));
      toast.success(" Meal deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete meal.");
    }
  };

  if (loading) return <p>Loading meals...</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nutrition Dashboard</h2>
        <Button
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={() => {
            setEditMeal(null);
            setShowForm(true);
          }}
        >
          + Add Meal
        </Button>
      </div>

      {/* ✅ Form Modal/Section */}
      {showForm && (
        <div className="bg-gray-50 border rounded-lg p-4 shadow">
          <NutritionForm
            initial={editMeal}
            onSaved={() => {
              setShowForm(false);
              fetchMeals();
              toast.success("Meal saved successfully!");
            }}
          />
          <Button
            className="mt-2 bg-gray-300 hover:bg-gray-400"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* ✅ Meal Logs List */}
      <div className="space-y-4">
        {meals.map((meal) => (
          <div
            key={meal._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold capitalize">{meal.mealType}</p>
              <p className="text-gray-500 text-sm">
                {new Date(meal.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-700 mt-1">
                Calories: <span className="font-bold">{meal.totalCalories}</span> | P:{" "}
                {meal.totals?.protein}g | C: {meal.totals?.carbs}g | F: {meal.totals?.fats}g
              </p>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  setEditMeal(meal);
                  setShowForm(true);
                }}
              >
                Edit
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => deleteMeal(meal._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
