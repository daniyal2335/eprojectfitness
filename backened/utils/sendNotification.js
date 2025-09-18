// sendNotification.js
import Notification from "../models/Notification.js";

/**
 * Send notification to a user (DB + Realtime via socket.io)
 * @param {Object} app - Express app instance
 * @param {String} userId - MongoDB user _id
 * @param {Object} payload - { message, type, link }
 */
export const sendNotification = async (
  app,
  userId,
  { message, type = "info", link = null }
) => {
  // ✅ Save in DB
  const notif = await Notification.create({
    user: userId,        
    message: message,    
    type: type,         
    link: link || undefined,
    isRead: false,
  });

  // ✅ Emit realtime socket event
  const io = app.get("io");
  if (io) {
    io.to(userId.toString()).emit("notification", {
      ...notif.toObject(),
      user: notif.user.toString(), // clean userId
    });
  }

  return notif;
};
