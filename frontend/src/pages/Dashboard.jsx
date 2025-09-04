import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../api/client";
import StatsCards from "../components/StatsCards";
import { WeeklyWorkoutsChart, WeightProgressChart } from "../components/Charts";
import WorkoutForm from "../components/WorkoutForm";
import NutritionForm from "../components/NutritionForm";
import { Card, CardContent } from "../components/ui/Card";
import toast from "react-hot-toast";

export default function DashboardHome() {
  const token = localStorage.getItem("token");

  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
        Please login
      </div>
    );

  const { user, setUser } = useOutletContext();
  const [stats, setStats] = useState({ totalWorkouts: 0, caloriesBurned: 0, hoursTrained: 0 });
  const [weekly, setWeekly] = useState([]);
  const [weights, setWeights] = useState([]);
  const [recent, setRecent] = useState({ recentWorkouts: [], recentMeals: [], latestProgress: null });
  const [loading, setLoading] = useState(true);

  // Search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ workouts: [], meals: [], users: [] });
  const [searching, setSearching] = useState(false);

  // 🔄 Dashboard load
  const load = async () => {
    try {
      setLoading(true);
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

      toast.success("Dashboard updated ✅");
    } catch (e) {
      console.error(e);
      toast.error("Failed to load dashboard ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🔎 Search function
  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) {
      setResults({ workouts: [], meals: [], users: [] });
      return;
    }
    try {
      setSearching(true);
      const res = await api(`/api/search?q=${q}`);
      setResults(res);
    } catch (err) {
      console.error("Search failed", err);
      toast.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Welcome back, {user?.name || "Athlete"} 👋
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Here’s a quick look at your fitness journey.
        </p>
      </div>

      {/* 🔎 Search Bar */}
      <Card className="shadow-lg">
        <CardContent>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search workouts, meals, or users..."
            className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searching && <p className="text-sm text-gray-500 mt-2">Searching...</p>}

          {query && (
            <div className="mt-4 space-y-4">
              {/* Workouts */}
              {results.workouts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Workouts</h4>
                  <ul className="space-y-1">
                    {results.workouts.map((w) => (
                      <li key={w._id} className="text-sm text-gray-700 border-b py-1">
                        {w.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meals */}
              {results.meals.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Meals</h4>
                  <ul className="space-y-1">
                    {results.meals.map((m) => (
                      <li key={m._id} className="text-sm text-gray-700 border-b py-1">
                        {m.mealType} • {m.totalCalories} kcal
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Users */}
              {results.users.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Users</h4>
                  <ul className="space-y-1">
                    {results.users.map((u) => (
                      <li
                        key={u._id}
                        className="flex items-center space-x-2 border-b py-1"
                      >
                        <img
                          src={u.profileImage || "/default-avatar.png"}
                          alt={u.username}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-700">{u.username}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.workouts.length === 0 &&
                results.meals.length === 0 &&
                results.users.length === 0 &&
                !searching && (
                  <p className="text-sm text-gray-500">No results found</p>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardContent className="overflow-x-auto">
            <WeeklyWorkoutsChart data={weekly} />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="overflow-x-auto">
            <WeightProgressChart data={weights} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg">
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium mb-2">Recent Workouts</p>
              <ul className="space-y-2">
                {(recent.recentWorkouts || []).map((w) => (
                  <li
                    key={w._id}
                    className="text-sm text-gray-700 border-b pb-1"
                  >
                    <span className="font-semibold">{w.title}</span> •{" "}
                    {new Date(w.performedAt).toLocaleDateString()}
                  </li>
                ))}
                {!recent.recentWorkouts?.length && (
                  <p className="text-sm text-gray-500">No workouts yet.</p>
                )}
              </ul>
            </div>

            <div>
              <p className="font-medium mb-2">Recent Meals</p>
              <ul className="space-y-2">
                {(recent.recentMeals || []).map((n) => (
                  <li
                    key={n._id}
                    className="text-sm text-gray-700 border-b pb-1"
                  >
                    <span className="capitalize">{n.mealType}</span> •{" "}
                    {n.totalCalories} kcal •{" "}
                    {new Date(n.date).toLocaleDateString()}
                  </li>
                ))}
                {!recent.recentMeals?.length && (
                  <p className="text-sm text-gray-500">No meals logged yet.</p>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CRUD Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Add Workout</h3>
            <WorkoutForm
              onSaved={() => {
                load();
                toast.success("Workout added 🎉");
              }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Log Nutrition</h3>
            <NutritionForm
              onSaved={() => {
                load();
                toast.success("Meal logged 🍎");
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
