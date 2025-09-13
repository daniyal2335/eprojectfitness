import { useEffect, useState } from "react";
import { getForumPosts } from "../api/forumApi"; // ✅ aapka helper
import ForumCard from "./ForumCard";

export default function ForumList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getForumPosts({ sort: "latest" }); 
      console.log("Forum API response:", data); 
      setPosts(data.posts || []); 
    } catch (err) {
      console.error("Failed to fetch forum posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading forum posts...</p>;
  if (!posts.length) return <p className="text-center mt-10">No posts yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {posts.map((post) => (
        <ForumCard key={post._id} post={post} />
      ))}
    </div>
  );
}
