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

//**Get a tage by slug */
export const getTagBySlug = async () => {
  const [rows] = await pool.query("SELECT * FROM tags WHERE slug = ?", [slug]);
  return rows[0];
};

//** Get a tag by Id */
export const getTagById = async (tagId) => {
  const [rows] = await pool.query("SELECT * FROM tags WHERE id = ?", [tagId]);
  return rows[0];
};

//** update tage */
export const updateTag = async (tagId, name, slug) => {
  const result = await pool.query(
    "UPDATE tags SET name = ? , slug = ? WHERE id = ?",
    [name, slug, tagId]
  );
  return result.affectedRows;
};

//**Delete a tag */
export const deleteATag = async (tagId) => {
  const result = await pool.query("DELETE FROM tags WHERE id = ?", [tagId]);
  return result.affectedRows;
};
