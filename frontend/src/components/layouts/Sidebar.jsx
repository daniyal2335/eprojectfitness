
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* 🔘 Top Bar for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white h-14 flex items-center justify-between px-4 z-50">
        <h1 className="text-lg font-bold">💪 FitTracker</h1>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-800"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 🌐 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-700 text-white flex flex-col justify-between transform transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div>
          {/* Logo Section */}
          <div className="h-20 flex items-center justify-center border-b border-gray-700">
            <h1 className="text-2xl font-bold">💪 FitTracker</h1>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/workouts"
              className="block px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Workouts
            </Link>

            {/* <Link
              to="/nutrition"
              className="block px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Nutrition
            </Link> */}
            <Link
              to="/nutrition-analytics"
              className="block px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Nutrition Analytics
            </Link>
            <Link
              to="/nutrition-dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Nutrition Dashboard
            </Link>
            {/* <Link
              to="/progress"
              className="block px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Progress
            </Link> */}
            <Link
              to="/progress-dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Progress Dashboard
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Edit Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              Settings
            </Link>
            <Link
              to="/feedback"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              Feedback
            </Link>

          </nav>
        </div>

        {/* 🚪 Sign Out at Bottom */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 text-red-400 hover:text-red-300"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
        ></div>
      )}
    </>
  );
}
