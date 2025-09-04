import { io } from "socket.io-client";
import { useEffect } from "react";

export default function useNotifications(userId, onNew) {
  useEffect(() => {
    if (!userId) return;
    const socket = io("http://localhost:5000"); // apna backend URL lagana

    // Join user-specific room
    socket.emit("join", userId);

    // Listen for notifications
    socket.on("notification", (notif) => {
      if (onNew) onNew(notif);
    });

    return () => socket.disconnect();
  }, [userId, onNew]);
}
