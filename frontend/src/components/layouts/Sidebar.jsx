import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 z-50 w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      <div className="h-20 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold">💪 FitTracker</h1>
      </div>
      <nav className="p-4 space-y-2">
        <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800">Dashboard</Link>
        <Link to="/workouts" className="block px-4 py-2 rounded hover:bg-gray-800">Workouts</Link>
        <Link to="/nutrition" className="block px-4 py-2 rounded hover:bg-gray-800">Nutrition</Link>
        <Link to="/progress" className="block px-4 py-2 rounded hover:bg-gray-800">Progress</Link>
        <Link to="/profile" className="block px-4 py-2 rounded hover:bg-gray-800">Edit Profile</Link>
        <Link to="/support" className="block px-4 py-2 rounded hover:bg-gray-800">Support</Link>
      </nav>
    </aside>
  );
}
