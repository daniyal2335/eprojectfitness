import { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import socket from "../socket";
import { api } from "../api/client";

export default function NotificationBell({ userId }) {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
useEffect(() => {
  if (!userId) return;

  socket.emit("register", userId); // ✅ backend ke register event se match

  return () => {
    socket.emit("unregister", userId); // optional cleanup
  };
}, [userId]);



  useEffect(() => {
    if (!userId) return;

    api("/api/notifications")
      .then((res) => {
        console.log("📥 Loaded unread notifications:", res);
        setList(res);
      })
      .catch((err) => console.error("Failed to load notifications", err));
  }, [userId]);

  // ✅ Listen for socket notifications
  useEffect(() => {
    if (!userId) return;

    const handleNotification = (notif) => {
      console.log("🔔 Socket notif:", notif);
      if (notif.user === userId && !notif.read) {
        setList((prev) => [notif, ...prev]);
          toast.success(notif.message); 
      }
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [userId]);

  // ✅ Mark as read (remove from list)
  const markAsRead = async (id) => {
    try {
      await api(`/api/notifications/mark-read/${id}`, { method: "POST" });
      setList((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-gray-100 border border-gray-300"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {list.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {list.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow p-3 z-50">
          <p className="font-medium mb-2">Notifications</p>
          <div className="space-y-2 max-h-64 overflow-auto">
           <ul className="space-y-2 max-h-64 overflow-auto">
  {list.length ? (
    list.map((n) => (
      <li
        key={n._id}
        className={`p-3 border-b cursor-pointer flex justify-between items-center ${
          n.isRead ? "bg-gray-100" : "bg-white"
        }`}
      >
        <div>
          <p className="text-sm">
            {n.type === "goal" && "🏆 "}
            {n.type === "workout" && "💪 "}
            {n.type === "follow" && "👥 "}
            {n.type === "like" && "👍 "}
            {n.type === "reply" && "💬 "}
            {n.message}
          </p>
          {n.link && (
            <a href={n.link} className="text-blue-500 text-xs">
              View
            </a>
          )}
        </div>

        <button
          onClick={() => markAsRead(n._id)}
          className="text-green-600 hover:text-green-800"
          title="Mark as read"
        >
          <CheckCircle size={18} />
        </button>
      </li>
    ))
  ) : (
    <p className="text-sm text-gray-500">No new notifications</p>
  )}
</ul>

          </div>
        </div>
      )}
    </div>
  );
}
