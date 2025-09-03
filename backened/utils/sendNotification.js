import Notification from "../models/Notification.js";

/**
 * Send notification to a user (DB + Realtime via socket.io)
 * @param {Object} app - Express app instance
 * @param {String} userId - MongoDB user _id
 * @param {String} message - Notification message
 */
export const sendNotification = async (app, userId, message) => {
  // ✅ Save in DB
  const notif = await Notification.create({
    user: userId,
    message,
    read: false,
  });

  // ✅ Emit realtime socket event
  const io = app.get("io");
  if (io) {
    io.to(userId.toString()).emit("notification", notif);
  }

  return notif;
};
