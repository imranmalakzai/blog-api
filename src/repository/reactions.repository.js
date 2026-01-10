import { pool } from "../config/db.config.js";

//** Create Reaction */
export const create = async (name) => {
  const [result] = await pool.query("INSERT INTO reactions (name) VALUE (?)", [
    name,
  ]);
  return result.insertId;
};

//** update a reaction */
export const update = async (name, id) => {
  const result = await pool.query(
    "UPDATE reactions SET name = ? WHERE id = ?",
    [name, id]
  );
  return result.affectedRows;
};

//** delete a reaction */
export const remove = async (id) => {
  const result = await pool.query("DELETE FROM reactions WHERE id = ? ", [id]);
  return result.affectedRows;
};
