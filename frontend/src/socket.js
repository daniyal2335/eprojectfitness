import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
  withCredentials: true,
});

export function registerSocket(userId) {
  if (userId && socket.connected) {
    socket.emit("register", userId);
  }
}

export function updateSocketToken(token) {
  if (!token) return;
  socket.auth = { token };
  if (socket.disconnected) {
    socket.connect();
  }
}

export default socket;
