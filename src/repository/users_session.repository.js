import { pool } from "../config/db.config.js";

//**Create a user seession */
export const createUserSession = async (data) => {
  const result = await pool.query(
    "INSERT INTO user_sessions (user_id,refresh_token,user_agent,ip_address,expires_at) VALUES (?,?,?,?,DATE_ADD(NOW(), INTERVAL 7 DAY))",
    [data.user_id, data.refresh_token, data.user_agent, data.ip_address]
  );
  return result.affectedRows;
};

//**Get A user sessions by Id */
export const currentUserSession = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM user_session WHERE user_id = ?",
    [userId]
  );
  return rows;
};

//**Delete a user session by refreshToken */
export const deleteSessionByToken = async (refreshToken) => {
  const result = await pool.query(
    "UPDATE user_sessions SET expires_at = NOW() WHERE refresh_token = ? AND expires_at  > NOW()",
    [refreshToken]
  );
  return result.affectedRows;
};

//**Get a user session by refreshToken */
export const tokenSession = async (refreshToken) => {
  const [rows] = await pool.query(
    "SELECT * FROM user_sessions WHERE refresh_token = ?  AND expires_at > NOW()",
    [refreshToken]
  );
  return rows[0];
};

//**Logout from All devices */
export const logoutFromAllDevices = async (userId) => {
  const result = await pool.query(
    "UPDATE user_sessions SET expires_at = NOW() WHERE user_id = ?",
    [userId]
  );
  return result.affectedRows;
};
