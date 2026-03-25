import { asyncHandler } from "../utils/async-handler.js";
import { Notification } from "../models/notification.model.js";

export const getAdminNotifications = asyncHandler(async (_req, res) => {
  const notifications = await Notification.find({ recipientRole: "admin" })
    .sort("-createdAt")
    .limit(20)
    .populate("actor", "name email")
    .populate("order", "_id paymentStatus status");

  const unreadCount = await Notification.countDocuments({
    recipientRole: "admin",
    isRead: false,
  });

  res.json({ notifications, unreadCount });
});

export const markAdminNotificationsRead = asyncHandler(async (_req, res) => {
  await Notification.updateMany(
    { recipientRole: "admin", isRead: false },
    { $set: { isRead: true } },
  );

  res.json({ success: true });
});
