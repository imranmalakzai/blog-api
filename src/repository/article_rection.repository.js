import { pool } from "../config/db.config.js";

//** Like an article */
export const createLikeArticle = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO article_reactions (articleId,user_id,reaction_id) VALUES (?,?,?)",
    [data.articleId, data.user_id, data.reaction_id]
  );
  return result.insertId;
};
