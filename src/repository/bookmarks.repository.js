import { pool } from "../config/db.config.js";

//** bookmarks on article */
export const create = async (articleId, userId) => {
  const [result] = await pool.query(
    "INSERT INTO bookmarks (article_id,user_id) VALUES  (?,?)",
    [articleId, userId],
  );
  return result.affectedRows;
};

//** Remove from bookmarks on article */
export const remove = async (articleId, userId) => {
  const result = await pool.query(
    "DELETE FROM bookmarks WHERE article_id = ? AND user_id = ?",
    [articleId, userId],
  );
  return result.affectedRows;
};

//** Get bookmarks articles */
export const bookmarks = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM bookmarks WHERE user_id = ?",
    userId,
  );
  return rows;
};

/**Get a bookmarked article */
export const bookmark = async (articleId, userId) => {
  const [rows] = await pool.query(
    "SELECT a.*,b.*,u.id as user_id,u.username as author,u.avatar_url FROM bookmarks b JOIN articles a ON a.id = b.article_id JOIN users u ON u.id = a.author_id WHERE b.article_id = ? AND b.user_id = ?",
    [articleId, userId],
  );
  return rows[0];
};
