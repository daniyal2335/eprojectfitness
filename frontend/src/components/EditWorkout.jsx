import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import WorkoutForm from "./WorkoutForm";

export default function EditWorkout() {
  const { id } = useParams();       // /workouts/:id
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchWorkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api(`/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkout(data);
    } catch (err) {
      console.error("Failed to fetch workout:", err);
      setError("Could not load workout");
    } finally {
      setLoading(false);
    }
  };

  fetchWorkout();
}, [id]);


  if (loading) return <p>Loading workout...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!workout) return <p>No workout found</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <WorkoutForm
        initial={workout}
        onSaved={() => navigate("/workouts")}
      />
    </div>
  );
}
