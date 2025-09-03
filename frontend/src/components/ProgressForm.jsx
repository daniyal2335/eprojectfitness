import { useState } from "react";
import { api } from "../api/client";

export default function ProgressForm({ onSaved }) {
  const [form, setForm] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    runTime: "",
    liftMax: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" })); // clear error for that field
  };

  const validate = () => {
    const errs = {};

    // Required weight
    if (!form.weight) errs.weight = "Weight is required.";
    else if (form.weight <= 0) errs.weight = "Weight must be greater than 0.";

    // Optional but >0 if filled
    ["chest", "waist", "hips", "arms", "thighs", "runTime", "liftMax"].forEach(
      (field) => {
        if (form[field] && form[field] <= 0) {
          errs[field] = `${field} must be greater than 0.`;
        }
      }
    );

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage(null);

    try {
      await api("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      setMessage({ type: "success", text: "✅ Progress saved successfully!" });
      onSaved?.();
      setForm({
        weight: "",
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: "",
        runTime: "",
        liftMax: "",
      }); // reset form
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Failed to save progress." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "border p-2 w-full rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form
      onSubmit={save}
      className="space-y-3 bg-white p-6 rounded-2xl shadow"
    >
      <h2 className="font-bold text-lg">Record Progress</h2>

      {/* ✅ Success/Error Message */}
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

      {/* Weight */}
      <div>
        <input
          placeholder="Weight (kg)"
          type="number"
          value={form.weight}
          onChange={(e) => handleChange("weight", Number(e.target.value))}
          className={inputClass}
        />
        {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
      </div>

      {/* Chest */}
      <div>
        <input
          placeholder="Chest (cm)"
          type="number"
          value={form.chest}
          onChange={(e) => handleChange("chest", Number(e.target.value))}
          className={inputClass}
        />
        {errors.chest && <p className="text-red-500 text-sm">{errors.chest}</p>}
      </div>

      {/* Waist */}
      <div>
        <input
          placeholder="Waist (cm)"
          type="number"
          value={form.waist}
          onChange={(e) => handleChange("waist", Number(e.target.value))}
          className={inputClass}
        />
        {errors.waist && <p className="text-red-500 text-sm">{errors.waist}</p>}
      </div>

      {/* Hips */}
      <div>
        <input
          placeholder="Hips (cm)"
          type="number"
          value={form.hips}
          onChange={(e) => handleChange("hips", Number(e.target.value))}
          className={inputClass}
        />
        {errors.hips && <p className="text-red-500 text-sm">{errors.hips}</p>}
      </div>

      {/* Arms */}
      <div>
        <input
          placeholder="Arms (cm)"
          type="number"
          value={form.arms}
          onChange={(e) => handleChange("arms", Number(e.target.value))}
          className={inputClass}
        />
        {errors.arms && <p className="text-red-500 text-sm">{errors.arms}</p>}
      </div>

      {/* Thighs */}
      <div>
        <input
          placeholder="Thighs (cm)"
          type="number"
          value={form.thighs}
          onChange={(e) => handleChange("thighs", Number(e.target.value))}
          className={inputClass}
        />
        {errors.thighs && <p className="text-red-500 text-sm">{errors.thighs}</p>}
      </div>

      {/* Run Time */}
      <div>
        <input
          placeholder="Run Time (min)"
          type="number"
          value={form.runTime}
          onChange={(e) => handleChange("runTime", Number(e.target.value))}
          className={inputClass}
        />
        {errors.runTime && (
          <p className="text-red-500 text-sm">{errors.runTime}</p>
        )}
      </div>

      {/* Lift Max */}
      <div>
        <input
          placeholder="Max Lift (kg)"
          type="number"
          value={form.liftMax}
          onChange={(e) => handleChange("liftMax", Number(e.target.value))}
          className={inputClass}
        />
        {errors.liftMax && (
          <p className="text-red-500 text-sm">{errors.liftMax}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Progress"}
      </button>
    </form>
  );
}
