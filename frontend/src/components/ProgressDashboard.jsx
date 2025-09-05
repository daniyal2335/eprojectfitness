import { useEffect, useState } from "react";
import ProgressForm from "./ProgressForm";
import { api } from "../api/client";
import toast from "react-hot-toast";

export default function ProgressDashboard({ userId }) {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);

  // ✅ Fetch all progress records
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api("/api/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(Array.isArray(data) ? data : data.records || []);
    } catch (err) {
      console.error("Failed to fetch progress records:", err);
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const token = localStorage.getItem("token");
      await api(`/api/progress/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Record deleted successfully!");
      fetchRecords();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  return (
    <div className="space-y-6">
      {/* Form for create/edit */}
      <ProgressForm
        key={editing?._id || "new"}
        onSaved={() => {
          setEditing(null);
          fetchRecords();
        }}
        initial={editing || {}}
      />

      {/* Records List */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold mb-4">My Progress Records</h2>

        {records.length === 0 ? (
          <p className="text-gray-500">No records yet.</p>
        ) : (
          <ul className="divide-y">
            {records.map((r) => (
              <li
                key={r._id}
                className="py-3 flex justify-between items-center"
              >
                <div className="text-sm">
                  <p className="font-semibold">
                    Weight: {r.weight} kg | Chest: {r.chest || "-"} cm | Waist:{" "}
                    {r.waist || "-"} cm
                  </p>
                  <p className="text-gray-500">
                    Hips: {r.hips || "-"} | Arms: {r.arms || "-"} | Thighs:{" "}
                    {r.thighs || "-"} | Run: {r.runTime || "-"} min | Lift Max:{" "}
                    {r.liftMax || "-"} kg
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(r)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
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
