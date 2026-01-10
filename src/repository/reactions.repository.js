import { pool } from "../config/db.config.js";

//** Create Reaction */
export const create = async (name) => {
  const [result] = await pool.query("INSERT INTO reactions (name) VALUE (?)", [
    name,
  ]);
  return result.insertId;
};
