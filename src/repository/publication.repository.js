import { pool } from "../config/db.config.js";

//**create create publications */
export const create = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO publications (name,slug,description,owner_id) VALUES (?,?,?,?)",
    [data.name, data.slug, data.description, data.owner_id],
  );
  return result.insertId;
};

//** Get all putlictions */
export const publications = async () => {
  const [rows] = await pool.query(
    "SELECT p.id,p.name,p.description,u.username as owner FROM publications p JOIN users u ON u.id = p.owner_id ",
  );
  return rows;
};

//**Get a publicationby Id */
export const publicationById = async (publicationId) => {
  const [rows] = await pool.query("SELECT * FROM publications WHERE id = ?", [
    publicationId,
  ]);
  return rows[0];
};

//**Get a publiction by slug  (use in middlewares)*/
export const publicationBySlug = async (slug) => {
  const [rows] = await pool.query(
    `SELECT id,owner_id FROM publications WHERE slug = ?`,
    [slug],
  );
  return rows[0];
};

//** Get a publication by slug (use to fetch publication) */
export const getPublicationBySlug = async (slug) => {
  const [rows] = await pool.query(
    "SELECT u.username as owner,p.id,p.name,p.description FROM publications p JOIN users u ON p.owner_id = u.id WHERE p.slug = ?",
    [slug],
  );
  return rows[0];
};

//** Update a publications  */
export const updatePublications = async (data, publicationId) => {
  const result = await pool.query(
    "UPDATE publications SET name = ?,slug = ?, description = ?  WHERE id = ? ",
    [data.name, data.slug, data.description, publicationId],
  );
  return result.affectedRows;
};

//**Delete  publication by Id */
export const deletePublication = async (publicationId) => {
  const result = await pool.query("DELETE FROM publications WHERE id = ?", [
    publicationId,
  ]);
  return result.affectedRows;
};
