import { useState } from "react";
import { api } from "../api/client";
import toast from "react-hot-toast";
import { Button } from "./ui/Button";
// CreateForumPost.jsx ke top me
import { createPost } from "../api/forumApi";

export default function CreateForumPost({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.content.trim()) errs.content = "Content is required.";
    if (!form.category) errs.category = "Category is required.";
    return errs;
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length) return setErrors(errs);

  setLoading(true);
  try {
    const post = await createPost({
      title: form.title,
      content: form.content,
      category: form.category,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
    });

    toast.success("Post created ✅");
    setForm({ title: "", content: "", category: "", tags: "" });

    if (onCreated) onCreated(post);
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Failed to create post ❌");
  } finally {
    setLoading(false);
  }
};



  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-lg">
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Post title"
        className={`w-full border rounded px-3 py-2 ${errors.title ? "border-red-500" : ""}`}
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Write your content..."
        rows={5}
        className={`w-full border rounded px-3 py-2 ${errors.content ? "border-red-500" : ""}`}
      />
      {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className={`w-full border rounded px-3 py-2 ${errors.category ? "border-red-500" : ""}`}
      >
        <option value="">Select category</option>
        <option value="general-discussion">General Discussion</option>
        <option value="workout-tips">Workout Tips</option>
        <option value="nutrition-advice">Nutrition Advice</option>
        <option value="progress-sharing">Progress Sharing</option>
        <option value="motivation">Motivation</option>
        <option value="questions">Questions</option>
        <option value="success-stories">Success Stories</option>
        <option value="equipment-reviews">Equipment Reviews</option>
      </select>
      {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

      <input
        type="text"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="Tags (comma separated)"
        className="w-full border rounded px-3 py-2"
      />

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 text-white" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
