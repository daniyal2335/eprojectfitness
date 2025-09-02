import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import Workouts from "./components/WorkoutForm.jsx";
import Layout from "./components/layouts/DashboardLayout.jsx";
import NutritionForm from "./components/NutritionForm.jsx";

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
          <Route path="/workouts" element={<Workouts />} />
              <Route path="/nutrition" element={<NutritionForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
