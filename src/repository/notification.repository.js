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
export const notifications = async(async (userId) => {
  const [rows] = await pool.query(
    "SELECT u.id as userId,u.username,u.avatar_url,n.id,n.type,n.is_read FROM notifications n JOIN users u ON u.id = n.user_id WHERE n.user_id  = ?",
    [userId]
  );
  return rows;
});
