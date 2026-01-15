import { pool } from "../config/db.config.js";

//** create notification */
export const create = async(async (data) => {
  const [result] = await pool.query(
    "INSERT INTO notifications user_id = ? , actor_id = ?, type = ?, entity_id = ?",
    [data.user_id, data.actor_id, data.type, data.entity_id]
  );
  return result.insertId;
});
