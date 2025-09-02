import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api/client";

export default function WorkoutForm({ initial = {}, onSaved }) {
  const [form, setForm] = useState({
    title: "",
    category: "strength",
    duration: 0,
    calories: 0,
    tags: [],
    exercises: [{ name: "", sets: 0, reps: 0, weight: 0, notes: "" }],
    ...initial,
  });

  const [errors, setErrors] = useState({}); // ✅ validation errors
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const setEx = (i, k, v) =>
    setForm((s) => {
      const arr = [...s.exercises];
      arr[i] = { ...arr[i], [k]: v };
      return { ...s, exercises: arr };
    });

  // ✅ Validation rules
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.duration <= 0) errs.duration = "Duration must be greater than 0";
    if (form.calories < 0) errs.calories = "Calories cannot be negative";
    form.exercises.forEach((ex, i) => {
      if (!ex.name.trim()) errs[`exercise-${i}-name`] = "Exercise name required";
      if (ex.sets < 0) errs[`exercise-${i}-sets`] = "Sets cannot be negative";
      if (ex.reps < 0) errs[`exercise-${i}-reps`] = "Reps cannot be negative";
      if (ex.weight < 0) errs[`exercise-${i}-weight`] = "Weight cannot be negative";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  setMessage(null);

  try {
    const payload = {
      ...form,
      tags:
        typeof form.tags === "string"
          ? form.tags.split(",").map((t) => t.trim())
          : form.tags,
    };

    const path = initial?._id
      ? `/api/workouts/${initial._id}`
      : "/api/workouts";
    const method = initial?._id ? "PUT" : "POST";

    const token = localStorage.getItem("token");

    await api(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setMessage({ type: "success", text: "✅ Workout saved successfully!" });
    onSaved?.();
  } catch (err) {
    console.error(err);
    setMessage({ type: "error", text: "❌ Failed to save workout" });
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.form
      onSubmit={save}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 bg-white p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-xl font-bold text-center mb-4">
        {initial?._id ? "Edit Workout" : "Create Workout"}
      </h2>

      {/* ✅ Success/Error message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Title */}
      <div>
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Workout Title"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Category, Duration, Calories */}
      <div className="grid grid-cols-3 gap-3">
        <select
          className="border rounded-lg px-3 py-2"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        >
          <option>strength</option>
          <option>cardio</option>
          <option>mobility</option>
          <option>other</option>
        </select>
        <div>
          <input
            type="number"
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Duration (min)"
            value={form.duration}
            onChange={(e) => set("duration", Number(e.target.value))}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm">{errors.duration}</p>
          )}
        </div>
        <div>
          <input
            type="number"
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Calories"
            value={form.calories}
            onChange={(e) => set("calories", Number(e.target.value))}
          />
          {errors.calories && (
            <p className="text-red-500 text-sm">{errors.calories}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <input
        className="w-full border rounded-lg px-3 py-2"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={(e) => set("tags", e.target.value)}
      />

      {/* Exercises */}
      <div className="space-y-3">
        <p className="font-medium">Exercises</p>
        {form.exercises.map((ex, i) => (
          <div key={i} className="grid grid-cols-5 gap-2">
            <div>
              <input
                className="border rounded px-2 py-1 w-full"
                placeholder="Name"
                value={ex.name}
                onChange={(e) => setEx(i, "name", e.target.value)}
              />
              {errors[`exercise-${i}-name`] && (
                <p className="text-red-500 text-xs">
                  {errors[`exercise-${i}-name`]}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                placeholder="Sets"
                value={ex.sets}
                onChange={(e) => setEx(i, "sets", Number(e.target.value))}
              />
              {errors[`exercise-${i}-sets`] && (
                <p className="text-red-500 text-xs">
                  {errors[`exercise-${i}-sets`]}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                placeholder="Reps"
                value={ex.reps}
                onChange={(e) => setEx(i, "reps", Number(e.target.value))}
              />
              {errors[`exercise-${i}-reps`] && (
                <p className="text-red-500 text-xs">
                  {errors[`exercise-${i}-reps`]}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                placeholder="Weight"
                value={ex.weight}
                onChange={(e) => setEx(i, "weight", Number(e.target.value))}
              />
              {errors[`exercise-${i}-weight`] && (
                <p className="text-red-500 text-xs">
                  {errors[`exercise-${i}-weight`]}
                </p>
              )}
            </div>
            <input
              className="border rounded px-2 py-1"
              placeholder="Notes"
              value={ex.notes}
              onChange={(e) => setEx(i, "notes", e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm underline text-blue-600"
          onClick={() =>
            set("exercises", [
              ...form.exercises,
              { name: "", sets: 0, reps: 0, weight: 0, notes: "" },
            ])
          }
        >
          + Add exercise
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 w-full"
      >
        {loading ? "Saving..." : "Save Workout"}
      </motion.button>
    </motion.form>
  );
}
