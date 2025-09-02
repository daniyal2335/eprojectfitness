import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const [form, setForm] = useState({ name: "", username: "", email: "", profileImage: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // ✅ new state for success/error

  const API_BASE = "/api/profile";

  // Load user data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Using token:", token);

        const res = await fetch(`${API_BASE}/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");
        const user = await res.json();
        console.log("Fetched user:", user);

        setForm({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          profileImage: user.profileImage || ""
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setMessage({ type: "error", text: "❌ Failed to load profile" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profileImage: reader.result.split(",")[1] }));
    };
    reader.readAsDataURL(file);
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "✅ Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: "❌ Update failed: " + (data.message || "") });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Update failed" });
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        {/* ✅ Message Box */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={form.profileImage ? `data:image/png;base64,${form.profileImage}` : "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover"
          />
          <label className="mt-2 bg-blue-600 px-3 py-1 text-sm rounded-lg text-white cursor-pointer">
            Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
