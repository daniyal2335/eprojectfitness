import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";

export default function NutritionForm({ initial = null, onSaved }) {
  const [mealType, setMealType] = useState("breakfast");
  const [items, setItems] = useState([
    { name: "", qty: 1, unit: "serving", calories: 0, protein: 0, carbs: 0, fats: 0 },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Pre-fill data if editing
  useEffect(() => {
    if (initial) {
      setMealType(initial.mealType || "breakfast");
      setItems(initial.items || []);
    }
  }, [initial]);

  const setItem = (i, k, v) =>
    setItems((s) => {
      const a = [...s];
      a[i] = { ...a[i], [k]: v ?? a[i][k] ?? 0 };
      return a;
    });

  const validate = () => {
    if (!mealType) return "Please select a meal type.";
    for (const item of items) {
      if (!item.name?.trim()) return "Food name cannot be empty.";
      if ((item.qty ?? 0) <= 0) return "Quantity must be greater than 0.";
      if ((item.calories ?? 0) < 0 || (item.protein ?? 0) < 0 || (item.carbs ?? 0) < 0 || (item.fats ?? 0) < 0)
        return "Nutrients cannot be negative.";
    }
    return null;
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      const payload = { mealType, items };

      if (initial && initial._id) {
        // 🔹 Update existing meal
        await api(`/api/nutrition/${initial._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        setSuccess("✅ Meal updated successfully!");
      } else {
        // 🔹 Add new meal
        await api("/api/nutrition", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        setSuccess("✅ Meal added successfully!");
      }

      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error saving meal. Please try again.");
    }
  };

  return (
    <form onSubmit={save} className="space-y-6 max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800">
        {initial ? "Edit Meal" : "Log Your Meal"}
      </h2>

      {/* Success/Error Messages */}
      {success && <p className="text-green-600 font-semibold">{success}</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Meal Type Selector */}
      <div className="w-1/2">
        <Select
          value={mealType ?? "breakfast"}
          onChange={setMealType}
          options={[
            { value: "breakfast", label: "Breakfast" },
            { value: "lunch", label: "Lunch" },
            { value: "dinner", label: "Dinner" },
            { value: "snacks", label: "Snacks" },
          ]}
        />
      </div>

      {/* Nutrition Items */}
      {items?.map((it, i) => (
        <Card key={i} className="p-5 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
            <Input placeholder="Food" value={it.name ?? ""} onChange={(e) => setItem(i, "name", e.target.value)} />
            <Input type="number" placeholder="Qty" value={it.qty ?? 1} min={1} onChange={(e) => setItem(i, "qty", Number(e.target.value))} />
            <Input placeholder="Unit" value={it.unit ?? "serving"} onChange={(e) => setItem(i, "unit", e.target.value)} />
            <Input type="number" placeholder="Calories" value={it.calories ?? 0} min={0} onChange={(e) => setItem(i, "calories", Number(e.target.value))} className="text-red-600 font-semibold" />
            <Input type="number" placeholder="Protein" value={it.protein ?? 0} min={0} onChange={(e) => setItem(i, "protein", Number(e.target.value))} className="text-blue-600 font-semibold" />
            <Input type="number" placeholder="Carbs" value={it.carbs ?? 0} min={0} onChange={(e) => setItem(i, "carbs", Number(e.target.value))} className="text-yellow-600 font-semibold" />
            <Input type="number" placeholder="Fats" value={it.fats ?? 0} min={0} onChange={(e) => setItem(i, "fats", Number(e.target.value))} className="text-green-600 font-semibold" />
          </CardContent>
        </Card>
      ))}

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          className="text-sm underline bg-gray-100 text-gray-700 hover:bg-gray-200"
          onClick={() =>
            setItems([
              ...(items ?? []),
              { name: "", qty: 1, unit: "serving", calories: 0, protein: 0, carbs: 0, fats: 0 },
            ])
          }
        >
          + Add Item
        </Button>

        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
          {initial ? "Update Meal" : "Save Meal"}
        </Button>
      </div>
    </form>
  );
}
