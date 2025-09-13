import axios from "axios";

const API = axios.create({
  baseURL: "/api", // Vite proxy will forward to backend
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Create post
export const createPost = async ({ title, content, category }) => {
  const res = await API.post("/forum", { title, content, category });
  return res.data;
};

// Get all posts
export const getForumPosts = async (params = {}) => {
  const res = await API.get("/forum", { params });
  return res.data.posts; // <-- IMPORTANT: posts are inside data.posts
};

// Get single post
export const getForumPost = async (id) => {
  const res = await API.get(`/forum/${id}`);
  return res.data;
};

// Like post
export const likePost = async (id) => {
  const res = await API.post(`/forum/${id}/like`);
  return res.data; // should include { isLiked, likesCount }
};


// Reply to post
export const replyPost = async (id, content) => {
  const res = await API.post(`/forum/${id}/reply`, { content });
  return res.data;
};
