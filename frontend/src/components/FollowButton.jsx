import { useState } from "react";
import toast from "react-hot-toast";
import { followForum, unfollowForum } from "../api/forumApi";

export default function FollowButton({ targetId, initialFollowed = false, onFollowChange }) {
  const [isFollowing, setIsFollowing] = useState(initialFollowed);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      let data;
      if (isFollowing) {
        data = await unfollowForum(targetId);
      } else {
        data = await followForum(targetId);
      }
      setIsFollowing(data.isFollowed);
      if (onFollowChange) onFollowChange(data.isFollowed);
      toast.success(`${data.isFollowed ? "Followed" : "Unfollowed"} (${data.followersCount} followers)`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Failed to update follow status");
      console.error("Follow error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
        isFollowing
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
