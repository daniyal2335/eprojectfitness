import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../api/client";
import ExerciseList from "./ExerciseList";
import toast from "react-hot-toast";

export default function WorkoutForm({ initial = {}, onSaved }) {
  const emptyForm = {
    title: "",
    category: "strength",
    duration: 0,
    calories: 0,
    tags: [],
    exercises: [{ name: "", sets: 0, reps: 0, weight: 0, notes: "" }],
  };

  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

useEffect(() => {
  if (!initial) return;

  // Sirf tab update karo jab _id alag ho ya form empty ho
  if (initial._id !== form._id) {
    setForm({ ...emptyForm, ...initial });
  }
  // else do nothing
}, [initial]);

  // --- Validation ---
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

  // --- Tag Handlers ---
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !form.tags.includes(value)) {
        set("tags", [...form.tags, value]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput) {
      set("tags", form.tags.slice(0, -1));
    }
  };

  const removeTag = (index) => {
    set("tags", form.tags.filter((_, i) => i !== index));
  };

  // --- Save handler ---
  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        ...form,
        tags: Array.isArray(form.tags)
          ? form.tags
          : form.tags.split(",").map((t) => t.trim()),
      };

      const path = initial?._id ? `/api/workouts/${initial._id}` : "/api/workouts";
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

      toast.success(
        initial?._id
          ? `✅ "${form.title}" updated successfully!`
          : `✅ "${form.title}" created successfully!`
      );

      // ✅ Reset form if it was a "create"
      if (!initial?._id) {
        setForm(emptyForm);
        setTagInput("");
        setErrors({});
      }

      onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save workout");
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
      className="space-y-5 bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full"
    >
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
        {initial?._id ? "Edit Workout" : "Create Workout"}
      </h2>

      {/* Title */}
      <div>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
          placeholder="Workout Title"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Category, Duration, Calories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          className="border rounded-lg px-3 py-2 text-sm sm:text-base w-full"
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
            min={0}
            className="border rounded-lg px-3 py-2 w-full text-sm sm:text-base"
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
            min={0}
            className="border rounded-lg px-3 py-2 w-full text-sm sm:text-base"
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
      <div className="border rounded-lg px-3 py-2 flex flex-wrap gap-2 items-center">
        {form.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1 text-xs sm:text-sm"
          >
            {tag}
            <button
              type="button"
              className="text-blue-900 font-bold"
              onClick={() => removeTag(idx)}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] border-none focus:ring-0 outline-none py-1 text-sm sm:text-base"
          placeholder="Add tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />
      </div>

      {/* Exercises List */}
      <ExerciseList
        exercises={form.exercises}
        setExercises={(exs) => set("exercises", exs)}
        errors={errors}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 w-full text-sm sm:text-base"
      >
        {loading ? "Saving..." : "Save Workout"}
      </motion.button>
    </motion.form>
  );
}
