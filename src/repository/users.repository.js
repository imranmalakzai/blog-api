import { pool } from "../config/db.config.js";

//** user registration database query */
export const userRegistration = async (data) => {
  const result = await pool.query(
    "INSERT INTO users (username,email,password_hash,bio,avatar_url,role) VALUES (?,?,?,?,?,?)",
    [
      data.username,
      data.email,
      data.password_hash,
      data.bio,
      data.avatar_url,
      data.role,
    ]
  );
  return result.affectedRows;
};
