import { pool } from "../config/db.config.js";

//** Like an article */
export const createLikeArticle = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO article_reactions (article_id,user_id,reaction_id) VALUES (?,?,?)",
    [data.articleId, data.user_id, data.reaction_id],
  );
  return result.insertId;
};

//**Get all users React to an articles */
export const usersLikedArticle = async (articleId) => {
  const [rows] = await pool.query(
    "SELECT * FROM article_reactions WHERE article_id = ?",
    [articleId],
  );
  return rows;
};
