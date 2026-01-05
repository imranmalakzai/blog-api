import { pool } from "../config/db.config.js";

//** create a new tag */
export const tags = async (name, slug) => {
  const [result] = await pool.query(
    "INSERT INTO tags (name,slug) VALUES (?,?)",
    [name, slug]
  );
  return result.insertId;
};
