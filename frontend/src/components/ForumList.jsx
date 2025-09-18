import { useEffect, useState } from "react";
import { getForumPosts, likePost } from "../api/forumApi";
import ForumCard from "./ForumCard";
import { replyPost } from "../api/forumApi";

export default function ForumList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getForumPosts();
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

  // Handle like button click from child
  const handleLike = async (postId) => {
    try {
      const updated = await likePost(postId);
      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, isLikedByUser: updated.isLiked, likesCount: updated.likesCount }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

const handleReply = async (postId, content) => {
  try {
    const reply = await replyPost(postId, content);
    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? { ...p, repliesCount: (p.repliesCount || 0) + 1 }
          : p
      )
    );
  } catch (err) {
    console.error("Failed to reply:", err);
  }
};
  // Handle follow state update from child
  const handleFollowUpdate = (postId, isFollowed) => {
    setPosts(prev =>
      prev.map(p =>
        p._id === postId ? { ...p, isFollowedByUser: isFollowed } : p
      )
    );
  };

  if (loading) return <p className="text-center mt-10">Loading forum posts...</p>;
  if (!posts.length) return <p className="text-center mt-10">No posts yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {posts.map(post => (
        <ForumCard
          key={post._id}
          post={post}
          onLike={handleLike}
          onFollowUpdate={handleFollowUpdate}
          onViewComments={(id) => console.log("Show comments for post", id)}
        />
      ))}
    </div>
  );
}
