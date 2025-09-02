import ProfileImage from "../ProfileImage";
import NotificationBell from "../NotificationBell";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, exportCSV }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // agar token bhi store karte ho
    navigate("/login");
  };

  return (
    <header className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
      {/* Left Side: Welcome Text */}
      <div>
        <h2 className="text-xl font-bold">
          Welcome, {user?.name || user?.username || "Guest"} 👋
        </h2>
        <p className="text-gray-500">Your personalized fitness dashboard</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Export Buttons */}
        <button
          onClick={() => exportCSV("workouts")}
          className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
        >
          Export Workouts CSV
        </button>
        <button
          onClick={() => exportCSV("nutrition")}
          className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
        >
          Export Nutrition CSV
        </button>

        {/* Notification */}
        <NotificationBell />

        {/* User Avatar + Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 cursor-pointer">
            <ProfileImage
              base64={user?.profileImage || ""}
              alt="User Avatar"
              className="h-10 w-10 rounded-full border object-cover"
            />
            <span className="hidden sm:block font-medium text-gray-700">
              {user?.name || user?.username || "User"}
            </span>
          </div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
            >
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
