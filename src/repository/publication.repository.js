import { pool } from "../config/db.config.js";

//**create create publications */
export const create = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO publications (name,slug,description,owner_id) VALUES (?,?,?,?)",
    [data.name, data.slug, data.description, data.owner_id]
  );
  return result.insertId;
};

//** Get all putlictions */
export const pulications = async () => {
  const [rows] = await pool.query("SELECT * FROM publictions");
  return rows;
};
