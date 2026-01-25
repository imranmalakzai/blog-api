import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Notifications from "../repository/notification.repository.js";

//** My notifications */
export const notifications = asyncHandler(async (req, res) => {
  const notifications = await Notifications.notifications(req.user.id);
  res.status(200).json({ notifications: notifications || [] });
});
