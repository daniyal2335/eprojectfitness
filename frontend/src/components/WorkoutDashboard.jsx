import { useEffect, useState } from "react";
import WorkoutForm from "./WorkoutForm";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../socket";

export default function WorkoutDashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch workouts
  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api("/api/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.workouts)
        ? data.workouts
        : [];

      setWorkouts(list);
    } catch (err) {
      console.error("Failed to fetch workouts:", err);
      toast.error("Failed to load workouts ❌");
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ✅ Socket updates (refetch always + toast)
  useEffect(() => {
    const handleCreated = () => {
      fetchWorkouts();
      toast.success("Workout created ✅");
    };

    const handleUpdated = () => {
      fetchWorkouts();
      toast.success("Workout updated ✅");
    };

    const handleDeleted = () => {
      fetchWorkouts();
      toast.success("Workout deleted ✅");
    };

    socket.on("workout_created", handleCreated);
    socket.on("workout_updated", handleUpdated);
    socket.on("workout_deleted", handleDeleted);

    return () => {
      socket.off("workout_created", handleCreated);
      socket.off("workout_updated", handleUpdated);
      socket.off("workout_deleted", handleDeleted);
    };
  }, []);

// ✅ Delete workout
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this workout?")) return;

  try {
    const token = localStorage.getItem("token");
    await api(`/api/workouts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Optimistically remove from UI immediately
    setWorkouts((prev) => prev.filter((w) => w._id !== id));

    toast.success("Workout deleted ✅");
  } catch (err) {
    console.error("Failed to delete workout:", err);
    toast.error("Failed to delete workout ❌");
  }
};

  // ✅ Fields to skip
  const hiddenFields = ["_id", "user", "__v", "createdAt", "updatedAt"];

  // ✅ Helper to render values
  const renderValue = (key, value) => {
    if (Array.isArray(value)) {
      if (key === "tags") {
        return value.join(", ");
      }
      if (key === "exercises") {
        return value
          .map(
            (ex) =>
              `${ex.name} • ${ex.sets || 0} sets • ${ex.reps || 0} reps • ${
                ex.weight || 0
              } kg`
          )
          .join(" | ");
      }
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="space-y-6">
      <WorkoutForm
        initial={editing || {}}
        onSaved={() => {
          setEditing(null);
          fetchWorkouts();
        }}
      />

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">My Workouts</h2>

        {loading ? (
          <p>Loading...</p>
        ) : workouts.length === 0 ? (
          <p className="text-gray-500">No workouts yet.</p>
        ) : (
          <ul className="divide-y">
            {workouts.map((w) => (
              <li
                key={w._id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-indigo-700">{w.title}</p>
                  <p className="text-sm text-gray-600">
                    {Object.entries(w)
                      .filter(
                        ([key]) => !hiddenFields.includes(key) && key !== "title"
                      )
                      .map(([key, value]) => (
                        <span key={key} className="mr-3 block">
                          <strong className="capitalize">{key}:</strong>{" "}
                          {renderValue(key, value)}
                        </span>
                      ))}
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
