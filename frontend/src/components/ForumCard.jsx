import { Link } from "react-router-dom";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { useState } from "react";

export default function ForumCard({ post, onLike, onViewComments }) {
  if (!post) return null;

  const truncatedContent =
    post.content?.length > 150 ? post.content.slice(0, 150) + "..." : post.content;

  // Local state for immediate UI update
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const handleLocalLike = async () => {
    // Update UI immediately
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));

    // Call parent function to sync with backend
    if (onLike) await onLike(post._id, !isLiked);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-5 mb-4 hover:scale-[1.01] transition-transform duration-200">
      
      <Link to={`/forum/${post._id}`} className="group">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition">
          {post.title}
        </h2>
      </Link>

      <p className="mt-2 text-gray-600 dark:text-gray-300">{truncatedContent}</p>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-medium">{post.author?.username || "Anonymous"}</span>
        <div className="flex gap-4 items-center">
          {/* Like button */}
          <button
            onClick={handleLocalLike}
            className={`flex items-center gap-1 px-2 py-1 rounded ${
              isLiked ? "bg-blue-100 dark:bg-blue-700 text-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ThumbsUp size={16} /> {likesCount}
          </button>

          {/* Comments button */}
          <button
            onClick={() => onViewComments(post._id)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MessageCircle size={16} /> {post.repliesCount || 0}
          </button>
        </div>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
