import { pool } from "../config/db.config.js";

//** create a new tag */
export const createTags = async (name, slug) => {
  const [result] = await pool.query(
    "INSERT INTO tags (name,slug) VALUES (?,?)",
    [name, slug]
  );
  return result.insertId;
};

//**GET all tages */
export const getAllTags = async () => {
  const [rows] = await pool.query("SELECT * FROM tags");
  return rows;
};

//**Get a tag by name */
export const getTagByname = async (name) => {
  const [rows] = await pool.query("SELECT * FROM tags WHERE name = ?", [name]);
  return rows[0];
};
