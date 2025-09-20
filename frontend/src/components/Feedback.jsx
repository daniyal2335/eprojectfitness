import { useState } from "react";
import { api } from "../api/client";
import toast from "react-hot-toast";

export default function FeedbackForm() {
  const [type, setType] = useState("general");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api("/api/settings/feedback", {
        method: "POST",
        body: JSON.stringify({ type, message }),
      });
      toast.success("Feedback submitted 🙌");
      setMessage("");
    } catch {
      toast.error("Failed to submit feedback ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Feedback & Support</h2>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="general">General</option>
        <option value="bug">Bug Report</option>
        <option value="feature">Feature Request</option>
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your feedback here..."
        className="w-full border rounded p-2"
        required
      />

      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        Submit Feedback
      </button>
    </form>
  );
}
