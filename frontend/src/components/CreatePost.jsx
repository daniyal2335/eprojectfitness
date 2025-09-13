import { useState } from "react";
import { createPost } from "../api/forumApi";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general-discussion");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    try {
      await createPost({ title, content, category });
      navigate("/forum"); // go back to forum list
    } catch (err) {
      console.error("Create post error:", err.response?.data);
      setError(err.response?.data?.error || "Failed to create post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Post title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your post..."
          className="w-full border p-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="general-discussion">General Discussion</option>
          <option value="workout-tips">Workout Tips</option>
          <option value="nutrition-advice">Nutrition Advice</option>
          <option value="progress-sharing">Progress Sharing</option>
          <option value="motivation">Motivation</option>
          <option value="questions">Questions</option>
          <option value="success-stories">Success Stories</option>
          <option value="equipment-reviews">Equipment Reviews</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </form>
    </div>
  );
}
