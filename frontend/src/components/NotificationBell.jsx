import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import socket from "../socket"; // your socket instance
import { api } from "../api/client";

export default function NotificationBell({ userId }) {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);

  // Load existing notifications once
  useEffect(() => {
    if (!userId) return;

    api("/api/notifications")
      .then(setList)
      .catch((err) => console.error("Failed to load notifications", err));
  }, [userId]);

  // Socket listener
  useEffect(() => {
    if (!userId) return;

    const handleNotification = (notif) => {
      if (notif.user === userId) setList((prev) => [notif, ...prev]);
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [userId]);

  const unread = list.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-gray-100 border border-gray-300"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow p-3 z-50">
          <p className="font-medium mb-2">Notifications</p>
          <div className="space-y-2 max-h-64 overflow-auto">
            {list.length ? (
              list.map((n) => (
                <div key={n._id} className="text-sm border-b pb-2">
                  {n.message}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
