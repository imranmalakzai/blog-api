import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Notifications from "../repository/notification.repository.js";

//** My notifications */
export const notifications = asyncHandler(async (req, res) => {
  const notifications = await Notifications.notifications(req.user.id);
  res.status(200).json({ notifications: notifications || [] });
});

//** Get a notification */
export const notification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  //notification exist
  const notification = await Notifications.getNotificationById(
    notificationId,
    req.user.id,
  );
  if (!notification) throw new ApiError("Notification not exist", 404);
  res.status(200).json({ notification });
});

//** read a notification */
export const read = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notifications.getNotificationById(notificationId);
  if (!notification) throw new ApiError("Notification not exist", 404);

  //read notification
  const result = await Notifications.readNotification(
    notification.id,
    req.user.id,
  );
  if (result === 0) throw new ApiError("Internal server error", 500);
  res.status(200).json({ notification });
});
