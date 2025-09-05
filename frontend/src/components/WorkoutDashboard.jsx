import { useEffect, useState } from "react";
import WorkoutForm from "./WorkoutForm";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../socket"; // socket import

export default function WorkoutDashboard({ userId }) {
  const [workouts, setWorkouts] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api("/api/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Workouts API response:", data);
      setWorkouts(Array.isArray(data) ? data : data.workouts || []);
    } catch (err) {
      console.error("Failed to fetch workouts:", err);
      setWorkouts([]);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ✅ Listen for socket notifications (toaster + bell)
  useEffect(() => {
    if (!userId) return;

    const handleNotification = (notif) => {
      console.log("🔔 Socket notif:", notif);
      if (notif.user === userId && !notif.read) {
        toast.success(notif.message); // show toaster
      }
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    const token = localStorage.getItem("token");
    await api(`/api/workouts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchWorkouts();
  };

  return (
    <div className="space-y-6">
      {/* Workout Form */}
      <WorkoutForm
        initial={editing || {}}
        onSaved={() => {
          setEditing(null);
          fetchWorkouts();
        }}
      />

      {/* Workout List */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">My Workouts</h2>

        {workouts.length === 0 ? (
          <p className="text-gray-500">No workouts yet.</p>
        ) : (
          <ul className="divide-y">
            {workouts.map((w) => (
              <li key={w._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{w.title}</p>
                  <p className="text-sm text-gray-500">
                    {w.category} • {w.duration} min • {w.calories} cal
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/workouts/${w._id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
