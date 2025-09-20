import { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [form, setForm] = useState({ theme: "light", units: "metric", notifications: true });
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get("/api/settings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setForm(res.data || {});
        applyTheme(res.data?.theme || "light");
      })
      .catch(() => {});
  }, []);

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/settings",
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setStatus("✅ Settings updated successfully!");
      applyTheme(form.theme); // 👈 UI par theme apply karo
    } catch {
      setStatus("❌ Failed to update settings.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl mt-7">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        ⚙️ User Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
          <select
            value={form.theme}
            onChange={(e) => setForm({ ...form, theme: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>

        {/* Units */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Units</label>
          <select
            value={form.units}
            onChange={(e) => setForm({ ...form, units: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="metric">📏 Metric (kg, km)</option>
            <option value="imperial">⚖️ Imperial (lbs, miles)</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={form.notifications}
            onChange={(e) => setForm({ ...form, notifications: e.target.checked })}
            className="h-5 w-5 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Enable Notifications</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition duration-200"
        >
          Save Settings
        </button>
      </form>

      {/* Status Message */}
      {status && <p className="mt-4 text-center text-sm font-semibold text-green-600">{status}</p>}
    </div>
  );
}
