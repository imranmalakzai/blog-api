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
export const publications = async () => {
  const [rows] = await pool.query("SELECT * FROM publictions");
  return rows;
};

//**Get a publicationby Id */
export const publicationById = async (publicationId) => {
  const [rows] = await pool.query("SELECT * FROM publications WHERE id = ?", [
    publicationId,
  ]);
  return rows[0];
};
