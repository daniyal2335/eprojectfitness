import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import Workouts from "./components/WorkoutForm.jsx";
import Layout from "./components/layouts/DashboardLayout.jsx";
import NutritionForm from "./components/NutritionForm.jsx";
import EditWorkout from "./components/EditWorkout.jsx";
import NutritionAnalytics from "./components/NutritionAnalytics";

// ✅ Import charts from Charts.jsx
import { WeightProgressChart, WeeklyWorkoutsChart } from "./components/Charts.jsx";
import ProgressForm from "./components/ProgressForm.jsx";
import WorkoutDashboard from "./components/WorkoutDashboard.jsx";
import NutritionDashboard from "./components/NutritionDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Layout with Navbar + Sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/workouts" element={<WorkoutDashboard />} />
          <Route path="/nutrition" element={<NutritionForm />} />
          <Route path="/progress" element={<ProgressForm />} />
          <Route path="/weekly" element={<WeeklyWorkoutsChart />} />
          <Route path="/workouts/:id" element={<EditWorkout />} />
          <Route path="/nutrition-analytics" element={<NutritionAnalytics />} />
          <Route path="/nutrition-dashboard" element={<NutritionDashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
