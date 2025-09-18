import { useState } from "react";
import { api } from "../api/client";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";

export default function ProgressForm({ initialData = {}, onSaved }) {
  const [formData, setFormData] = useState({
    weight: initialData?.weight || "",
    bodyFat: initialData?.bodyFat || "",
    chest: initialData?.chest || "",
    waist: initialData?.waist || "",
    hips: initialData?.hips || "",
    arms: initialData?.arms || "",
    thighs: initialData?.thighs || "",
    runTime: initialData?.runTime || "",
    liftMax: initialData?.liftMax || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.weight || formData.weight <= 0) newErrors.weight = "Weight must be a positive number";
    if (!formData.bodyFat || formData.bodyFat < 0 || formData.bodyFat > 100) newErrors.bodyFat = "Body fat must be 0-100%";
    ["chest", "waist", "hips", "arms", "thighs"].forEach((field) => {
      if (!formData[field] || formData[field] <= 0) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be positive`;
    });
    if (!formData.runTime || formData.runTime < 0) newErrors.runTime = "Run time cannot be negative";
    if (!formData.liftMax || formData.liftMax < 0) newErrors.liftMax = "Max lift cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      let result;

      if (initialData && initialData._id) {
        result = await api(`/api/progress/${initialData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        result = await api("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (onSaved) onSaved(result.progress || result);
      toast.success("Progress saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save progress:", err);
      toast.error("Failed to save progress");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {Object.entries(formData).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="number"
            name={key}
            value={value}
            onChange={handleChange}
            className={`border rounded p-2 w-full ${errors[key] ? "border-red-500" : ""}`}
          />
          {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
        </div>
      ))}

      <div className="col-span-2 flex justify-end">
        <Button type="submit" className="bg-green-600 text-white">
          {initialData?._id ? "Update Progress" : "Save Progress"}
        </Button>
      </div>
    </form>
  );
}
