import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import socket from "./socket";
import toast, { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx"; 
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings";   // ✅ add
import Feedback from "./pages/Feedback";
import Profile from "./components/Profile.jsx";
import Workouts from "./components/WorkoutForm.jsx";
import Layout from "./components/layouts/DashboardLayout.jsx";
import NutritionForm from "./components/NutritionForm.jsx";
import EditWorkout from "./components/EditWorkout.jsx";
import NutritionAnalytics from "./components/NutritionAnalytics";
import { WeightProgressChart, WeeklyWorkoutsChart } from "./components/Charts.jsx";
import ProgressForm from "./components/ProgressForm.jsx";
import WorkoutDashboard from "./components/WorkoutDashboard.jsx";
import NutritionDashboard from "./components/NutritionDashboard.jsx";
import ProgressDashboard from "./components/ProgressDashboard.jsx";
import ForumPost from "./components/ForumPost.jsx";
import CreatePost from "./components/CreatePost.jsx";
import ForumList from "./components/ForumList.jsx";
import Testimonial from "./components/Testimonial.jsx"; 

import Packages from "./pages/Packages.jsx";
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}
function App() {
  //   useEffect(() => {
  //   socket.on("profile_updated", (data) => {
  //     if (data.userId === user._id) {
  //       setUser(prev => ({ ...prev, profilePicture: data.newPicture }));
  //     }
  //   });
  // }, [user._id]);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      toast.success(notification.message);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
            <Route path="/" element={<Home />} />  
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/testimonial" element={<Testimonial />} />
<Route path="/packages" element={<Packages />} />
        {/* Protected Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/workouts" element={<WorkoutDashboard />} />
          <Route path="/nutrition" element={<NutritionForm />} />
          <Route path="/progress" element={<ProgressForm />} />
          <Route path="/progress-dashboard" element={<ProgressDashboard />} />
          <Route path="/weekly" element={<WeeklyWorkoutsChart />} />
          <Route path="/workouts/:id" element={<EditWorkout />} />
          <Route path="/nutrition-analytics" element={<NutritionAnalytics />} />
          <Route path="/nutrition-dashboard" element={<NutritionDashboard />} />
          <Route path="/forum" element={<ForumList />} />
          <Route path="/forum/:id" element={<ForumPost />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="settings" element={<Settings />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
      </Routes>

      {/* ✅ Toaster global placement */}
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
