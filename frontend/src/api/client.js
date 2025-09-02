const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getToken = () => localStorage.getItem("token") || "";

export const api = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

const res = await fetch(`${API_URL}${path}`, { credentials:'include', headers, ...options });
const data = await res.json();
if (!res.ok) {
  throw new Error(data.message || 'Request failed');
}
return data;

 
};
