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
export const removeTag = async (articleId, tagId) => {
  const result = await pool.query(
    "DELETE FROM article_tags WHERE articleId = ? AND tagId = ?",
    [articleId, tagId]
  );
  return result.affectedRows;
};
