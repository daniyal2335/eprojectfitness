import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // relative to DashboardLayout.jsx
import Navbar from "./Navbar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 p-6 space-y-6">
        <Navbar />
        <Outlet /> {/* yahan child pages aayenge */}
      </div>
    </div>
  );
}
