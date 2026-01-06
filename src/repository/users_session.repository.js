import { pool } from "../config/db.config.js";

//**Create a user seession */
export const createUserSession = async (data) => {
  const result = await pool.query(
    "INSERT INTO user_sessions (user_id,refresh_token,user_agent,ip_address,expires_at) VALUES (?,?,?,?,DATE_ADD(NOW(), INTERVAL 7 DAY))",
    [data.user_id, data.refresh_token, data.user_agent, data.ip_address]
  );
  return result.affectedRows;
};

//**Get A user session by Id */
export const currentUserSession = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM user_session WHERE user_id = ?",
    [userId]
  );
  return rows;
};
