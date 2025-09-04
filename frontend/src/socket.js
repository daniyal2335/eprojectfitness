import { io } from "socket.io-client";

// ✅ backend ka URL sirf env se lo
const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});
export const registerSocket = (userId) => {
  if (userId) socket.emit("register", userId);
};

export default socket;
