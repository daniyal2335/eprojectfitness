import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForumPost, likePost, replyPost, followForum, unfollowForum } from "../api/forumApi";
import FollowButton from "./FollowButton";
import toast, { Toaster } from "react-hot-toast";

export default function ForumPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch post from backend
  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getForumPost(id);
      setPost(data);
    } catch (err) {
      console.error("Failed to fetch post", err);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found.</p>;

  // ================= LIKE HANDLER =================
  const handleLike = async () => {
    // Optimistic UI update
    setPost(prev => ({
      ...prev,
      isLikedByUser: !prev.isLikedByUser,
      likesCount: prev.isLikedByUser ? prev.likesCount - 1 : prev.likesCount + 1,
    }));

    try {
      const updated = await likePost(post._id);
      // Sync with backend
      setPost(prev => ({
        ...prev,
        isLikedByUser: updated.isLiked,
        likesCount: updated.likesCount,
      }));
    } catch (err) {
      console.error("Failed to like post", err);
      toast.error("Failed to update like");
      fetchPost(); // fallback to correct state
    }
  };

  // ================= FOLLOW HANDLER =================
  const handleFollowChange = async (newState) => {
    try {
      if (newState) {
        const data = await followForum(post._id);
        setPost(prev => ({
          ...prev,
          isFollowedByUser: data.isFollowed,
          followersCount: data.followersCount
        }));
      } else {
        const data = await unfollowForum(post._id);
        setPost(prev => ({
          ...prev,
          isFollowedByUser: data.isFollowed,
          followersCount: data.followersCount
        }));
      }
    } catch (err) {
      console.error("Follow error:", err);
      toast.error("Failed to update follow status");
    }
  };

  // ================= REPLY HANDLER =================
  const handleReply = async () => {
    if (!reply.trim()) return toast.error("Reply cannot be empty");

    // Optimistic UI update
    const tempReply = {
      _id: Date.now(), // temporary unique id
      content: reply,
      author: { username: "You" },
      createdAt: new Date(),
    };

    setPost(prev => ({
      ...prev,
      replies: [...prev.replies, tempReply],
      repliesCount: (prev.repliesCount || 0) + 1
    }));
    setReply("");

    try {
      const newReply = await replyPost(post._id, reply);
      setPost(prev => ({
        ...prev,
        replies: prev.replies.map(r => r._id === tempReply._id ? newReply : r)
      }));
    } catch (err) {
      console.error("Failed to reply", err);
      toast.error("Failed to send reply");
      fetchPost(); // fallback
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

      <div className="flex items-center gap-3 mb-4">
        {/* 👍 Like */}
        <button
          onClick={handleLike}
          className={`px-3 py-1 rounded ${
            post.isLikedByUser ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          👍 {post.likesCount || 0}
        </button>

        {/* 👥 Follow */}
        <FollowButton
          targetId={post._id}
          initialFollowed={post.isFollowedByUser}
          onFollowChange={handleFollowChange}
        />

        <span className="ml-2 text-sm text-gray-500">
          Followers: {post.followersCount || 0}
        </span>
      </div>

      {/* Replies Section */}
      <h2 className="font-semibold mb-2">Replies ({post.repliesCount || 0})</h2>
      <div className="space-y-3 mb-4">
        {post.replies?.length ? (
          post.replies.map(r => (
            <div key={r._id || r.createdAt} className="border p-2 rounded">
              <p>{r.content}</p>
              <span className="text-sm text-gray-500">{r.author?.username || "Anonymous"}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No replies yet</p>
        )}
      </div>

      {/* Reply Input */}
      <div className="flex gap-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleReply}
          className="bg-green-500 text-white px-4 rounded"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
