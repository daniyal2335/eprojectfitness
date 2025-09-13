import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForumPost, likePost, replyPost } from "../api/forumApi";
import toast, { Toaster } from "react-hot-toast";

export default function ForumPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState("");

  const fetchPost = async () => {
    try {
      const data = await getForumPost(id);
      setPost(data);
    } catch (err) {
      console.error("Failed to fetch post", err);
      toast.error("Failed to load post");
    }
  };

  
  useEffect(() => {
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading post...</p>;

  const handleLike = async () => {
    try {
      const res = await likePost(id);
      setPost({ ...post, isLiked: res.isLiked, likesCount: res.likesCount });
      toast.success(res.isLiked ? "You liked the post" : "Like removed");
    } catch (err) {
      console.error("Failed to like post", err);
      toast.error("Failed to like post");
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    try {
      const newReply = await replyPost(id, reply);
      setPost({ ...post, replies: [...(post.replies || []), newReply] });
      setReply("");
      toast.success("Reply added");
    } catch (err) {
      console.error("Failed to reply", err);
      toast.error("Failed to add reply");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

   <button
  onClick={handleLike}
  className={`px-3 py-1 rounded ${post.isLiked ? "bg-blue-500 text-white" : "bg-gray-200"}`}
>
  👍 {post.likesCount}
</button>


      <h2 className="mt-6 font-semibold">Replies</h2>
      <div className="space-y-3 mt-2">
        {post.replies?.length ? (
          post.replies.map((r, i) => (
            <div key={i} className="border p-2 rounded">
              <p>{r.content}</p>
              <span className="text-sm text-gray-500">{r.author?.username}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No replies yet</p>
        )}
      </div>

      <div className="mt-4 flex">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          placeholder="Write a reply..."
        />
        <button onClick={handleReply} className="bg-green-500 text-white px-4 rounded-r">
          Reply
        </button>
      </div>
    </div>
  );
}
