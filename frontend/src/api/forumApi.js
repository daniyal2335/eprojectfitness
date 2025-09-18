// src/api/forumApi.js
import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:3000/api", // frontend 5173 → backend 3000
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const createPost = async ({ title, content, category, tags = [] }) => {
  console.log("➡️ Sending to backend:", { title, content, category, tags });
  const res = await API.post("/forum", { title, content, category, tags });
  console.log("✅ Backend response:", res.data);
  return res.data.post;
};


// Get all posts (with likes/follows state)
export const getForumPosts = async (params = {}) => {
  const res = await API.get("/forum", { params });

  // Map posts to include isLikedByUser & isFollowedByUser
  return res.data.posts.map(post => ({
    ...post,
    isLikedByUser: post.likes.some(u => u._id === res.data.currentUserId),
    isFollowedByUser: post.followers.some(u => u._id === res.data.currentUserId),
    likesCount: post.likes.length,
    followersCount: post.followers.length,
    repliesCount: post.replies.length,
  }));
};

// Get single post (with state)
export const getForumPost = async (id) => {
  const res = await API.get(`/forum/${id}`);
  const post = res.data;

  return {
    ...post,
    isLikedByUser: post.likes.some(u => u._id === res.data.currentUserId),
    isFollowedByUser: post.followers.some(u => u._id === res.data.currentUserId),
    likesCount: post.likes.length,
    followersCount: post.followers.length,
    repliesCount: post.replies.length,
  };
};

// Like post
export const likePost = async (id) => {
  const res = await API.post(`/forum/${id}/like`);
  return {
    isLiked: res.data.isLiked,
    likesCount: res.data.likesCount,
  };
};

// Reply to post
export const replyPost = async (id, content) => {
  const res = await API.post(`/forum/${id}/reply`, { content });
  return res.data;
};

// Follow forum
export const followForum = async (id) => {
  const res = await API.post(`/forum/${id}/follow`);
  return {
    isFollowed: res.data.isFollowed,
    followersCount: res.data.followersCount,
  };
};

// Unfollow forum
export const unfollowForum = async (id) => {
  const res = await API.delete(`/forum/${id}/follow`);
  return {
    isFollowed: res.data.isFollowed,
    followersCount: res.data.followersCount,
  };
};

// Get followers of a forum
export const getForumFollowers = async (id) => {
  const res = await API.get(`/forum/${id}/followers`);
  return res.data; // array of users
};
