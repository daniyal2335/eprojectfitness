// DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { exportToCSV } from "../../utils/exportUtils";  // <-- Import utils

export default function DashboardLayout() {
  const [user, setUser] = useState(null);

  // Dummy state (workouts & nutrition) - actual me API se load karoge
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);

  // Centralized export handler
  const exportCSV = (type) => {
    if (type === "workouts") {
      exportToCSV(workouts, "workouts");
    }
    if (type === "nutrition") {
      exportToCSV(nutrition, "nutrition");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-h-screen bg-gray-100 p-4">
        <Navbar user={user} exportCSV={exportCSV} />
        <Outlet context={{ user, setUser, setWorkouts, setNutrition }} />
      </div>
    </div>
  );
}
