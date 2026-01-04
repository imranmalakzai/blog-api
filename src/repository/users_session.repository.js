import { pool } from "../config/db.config.js";

//**Create a user seession */
export const createUserSession = async (data) => {
  const result = await pool.query(
    "INSERT INTO user_sessions (user_id,refresh_token,user_agent,ip_address) VALUES (?,?,?,?)",
    [data.user_id, data.refresh_token, data.user_agent, data.ip_address]
  );
  return result.affectedRows;
};
