import { pool } from "../config/db.config.js";

//** Add tags in article */
export const create = async (articleId, tagId) => {
  const [result] = await pool.query(
    "INSERT INTO article_tags (article_id,tag_id) VALUES (?,?)",
    [articleId, tagId]
  );
  return result.insertId;
};

//**Remove tags from article */
export const remove = async (articleId, tagId) => {
  const result = await pool.query(
    "DELETE FROM article_tags WHERE articleId = ? AND tagId = ?",
    [articleId, tagId]
  );
  return result.affectedRows;
};

//** get all article tags */
export const articleTags = async (articleId) => {
  const [rows] = await pool.query(
    "SELECT * FROM article_tags WHERE article_id = ?",
    articleId
  );
  return rows;
};

//** Get an a tag on aticleTag byId */
export const articleTag = async (articleId, tagId) => {
  const [rows] = await pool.query(
    "SELECT * FROM article_tags WHERE article_id = ? AND tag_id = ?",
    [articleId, tagId]
  );
  return rows[0];
};
