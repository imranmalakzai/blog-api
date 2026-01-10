import { pool } from "../config/db.config.js";

//** bookmarks on article */
export const create = async (articleId, userId) => {
  const [result] = await pool.query(
    "INSERT INTO bookmarks (article_id,user_id) VALUES  (?,?)",
    [articleId, userId]
  );
  return result.insertId;
};

//** Remove from bookmarks on article */
export const remove = async (articleId, userId) => {
  const result = await pool.query(
    "DELETE FROM booksmarks WHERE article_id = ? AND user_id = ?",
    [articleId, userId]
  );
  return result.affectedRows;
};
