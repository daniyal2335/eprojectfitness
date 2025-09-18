import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProgressForm from "./ProgressForm";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { Button } from "./ui/Button";

export default function ProgressDashboard() {
  const [progresses, setProgresses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false); // 🔑 toggle state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Progress socket connected:", socket.id);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?._id) socket.emit("register", user._id);
    });

    socket.on("progress_created", (data) => {
      setProgresses((prev) => [data.progress, ...prev]);
      toast.success(data.message);
    });

    socket.on("progress_updated", (data) => {
      setProgresses((prev) =>
        prev.map((p) => (p._id === data.progress._id ? data.progress : p))
      );
      toast.success(data.message); // ✅ toast for socket update
    });

    socket.on("progress_deleted", (data) => {
      setProgresses((prev) => prev.filter((p) => p._id !== data.id));
      toast.success(data.message); // ✅ toast for socket delete
    });

    return () => socket.disconnect();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api("/api/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgresses(data);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this progress entry?")) return;

    try {
      const token = localStorage.getItem("token");
      await api(`/api/progress/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgresses((prev) => prev.filter((p) => p._id !== id));
      toast.success("Progress deleted ✅"); // ✅ added notification
    } catch (err) {
      console.error("Failed to delete progress:", err);
      toast.error("Failed to delete progress ❌");
    }
  };

  return (
    <div className="space-y-6">
   
     {/* 🔘 Toggle Add Progress */}
<div className="flex justify-end mt-5">
  <Button
    className="bg-green-600 text-white hover:bg-green-700"
    onClick={() => {
      setEditing(null); // reset edit
      setShowForm((prev) => !prev);
    }}
  >
    {showForm ? "Close Form" : "➕ Add Progress"}
  </Button>
</div>


      {/* Form only when showForm=true OR editing */}
      {(showForm || editing) && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <ProgressForm
            initialData={editing}
            onSaved={(progress) => {
              if (editing) {
                setProgresses((prev) =>
                  prev.map((p) => (p._id === progress._id ? progress : p))
                );
                toast.success("Progress updated ✅"); // ✅ notification for update
              } else {
                setProgresses((prev) => [progress, ...prev]);
                toast.success("Progress added ✅"); // ✅ notification for create
              }
              setEditing(null);
              setShowForm(false); // ✅ close form after save
            }}
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">My Progress</h2>

        {loading ? (
          <p>Loading...</p>
        ) : progresses.length === 0 ? (
          <p className="text-gray-500">No progress yet.</p>
        ) : (
          <ul className="divide-y">
            {progresses.map((p) => (
              <li key={p._id} className="py-3 flex justify-between items-center">
                <div>
                  <p>
                    <strong>Weight:</strong> {p.weight} kg •{" "}
                    <strong>Run:</strong> {p.runTime} min •{" "}
                    <strong>Lift:</strong> {p.liftMax} kg
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(p.recordedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600 text-white"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
