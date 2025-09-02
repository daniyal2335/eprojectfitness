import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatsCards from "../components/StatsCards";
import { WeeklyWorkoutsChart, WeightProgressChart } from "../components/Charts";
import WorkoutForm from "../components/WorkoutForm";
import NutritionForm from "../components/NutritionForm";

export default function DashboardHome() {
  const token = localStorage.getItem("token");
  if (!token)
    return <div className="min-h-screen flex items-center justify-center">Please login</div>;

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalWorkouts: 0, caloriesBurned: 0, hoursTrained: 0 });
  const [weekly, setWeekly] = useState([]);
  const [weights, setWeights] = useState([]);
  const [recent, setRecent] = useState({ recentWorkouts: [], recentMeals: [], latestProgress: null });

  const load = async () => {
    try {
      const [me, st, wk, wt, rc] = await Promise.all([
        api("/api/profile/me"),
        api("/api/dashboard/stats"),
        api("/api/dashboard/weekly-workouts"),
        api("/api/dashboard/weight-progress"),
        api("/api/dashboard/recent"),
      ]);
      setUser(me);
      setStats(st);
      setWeekly(wk);
      setWeights(wt);
      setRecent(rc);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyWorkoutsChart data={weekly} />
        <WeightProgressChart data={weights} />
      </div>

      {/* Recent summary */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-medium mb-2">Recent Workouts</p>
            <ul className="space-y-2">
              {(recent.recentWorkouts || []).map((w) => (
                <li key={w._id} className="text-sm text-gray-700">
                  {w.title} • {new Date(w.performedAt).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Recent Meals</p>
            <ul className="space-y-2">
              {(recent.recentMeals || []).map((n) => (
                <li key={n._id} className="text-sm text-gray-700">
                  {n.mealType} • {new Date(n.date).toLocaleDateString()} • {n.totalCalories} kcal
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CRUD sections */}
      <div id="workouts" className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Add Workout</h3>
        <WorkoutForm onSaved={load} />
      </div>

      <div id="nutrition" className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Log Nutrition</h3>
        <NutritionForm onSaved={load} />
      </div>
    </div>
  );
}
