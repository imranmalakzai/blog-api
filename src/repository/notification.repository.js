import { pool } from "../config/db.config.js";

//** create notification */
export const create = async(async (data) => {
  const [result] = await pool.query(
    "INSERT INTO notifications user_id = ? , actor_id = ?, type = ?, entity_id = ?",
    [data.user_id, data.actor_id, data.type, data.entity_id]
  );
  return result.insertId;
});

//** get all notification of a user */
export const notifications = async (userId) => {
  const [rows] = await pool.query(
    "SELECT u.id as userId,u.username,u.avatar_url,n.id,n.type,n.is_read FROM notifications n JOIN users u ON u.id = n.user_id WHERE n.user_id  = ?",
    [userId]
  );
  return rows;
};

//** Mark notification as read on notification */
export const readNotification = async (notificationId, userId) => {
  const result = await pool.query(
    `UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?`,
    [notificationId, userId]
  );
  return result.affectedRows;
};

//** Mark all notifications as read */
export const readNotifications = async (userId) => {
  const result = await pool.query(
    `UPDATE notifications SET is_read = true AND user_id = ?`,
    [userId]
  );
  return result.affectedRows;
};

//** delete a notification */
export const remove = async (notificationId, userId) => {
  const result = await pool.query(
    "DELETE FROM notifications WHERE notification_id = ? AND user_id = ?",
    [notificationId, userId]
  );
  return result.affectedRows;
};
