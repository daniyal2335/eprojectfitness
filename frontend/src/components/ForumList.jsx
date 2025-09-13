import { useEffect, useState } from "react";
import { getForumPosts, likePost } from "../api/forumApi";
import ForumCard from "./ForumCard";

export default function ForumList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getForumPosts();
      console.log("API response:", data); // make sure data is an array
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch forum posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Handle like
  const handleLike = async (postId) => {
    try {
      const updatedPost = await likePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, isLiked: updatedPost.isLiked, likesCount: updatedPost.likesCount }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading forum posts...</p>;
  if (!posts.length) return <p className="text-center mt-10">No posts yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {posts.map((post) => (
        <ForumCard
          key={post._id}
          post={post}
          onLike={handleLike} // ✅ pass it here
          onViewComments={(id) => console.log("Show comments for post", id)} // optional
        />
      ))}
    </div>
  );
}
