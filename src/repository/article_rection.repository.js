import { pool } from "../config/db.config.js";

//** Like an article */
export const createLikeArticle = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO article_reactions (articleId,user_id,reaction_id) VALUES (?,?,?)",
    [data.articleId, data.user_id, data.reaction_id],
  );
  return result.insertId;
};

//**Un like an article */
export const unlikeArticle = async (articleId, userId) => {
  const result = await pool.query(
    "DELETE FROM article_reactions WHERE article_id = ? AND user_id = ?",
    articleId,
    userId,
  );
  return result.affectedRows;
};

//**Get all users React to an articles */
export const usersLikedArticle = async (articleId) => {
  const [rows] = await pool.query(
    "SELECT * FROM article_reactions WHERE article_id = ?",
    [articleId],
  );
  return rows;
};

//**user reaction */
export const userReaction = async (userId, articleId) => {
  const [rows] = await pool.query(
    "SELECT id from article_reactions where article_id ? and user_id ?",
    [articleId, userId],
  );
  return rows[0];
};

//**Remove Reaction from an article */
export const remove = async (userId, articleId) => {
  const result = await pool.query(
    "DELETE FROM article_reactions WHERE article_id = ? and user_id = ?",
    [articleId, userId],
  );
  return result.affectedRows;
};

//**Update reaction an article */
export const update = async (userId, articleId, reactionId) => {
  const result = await pool.query(
    "UPDATE article_reactions SET reaction_id = ? WHERE user_id = ? and article_id = ?",
    [reactionId, userId, articleId],
  );
  return result.affectedRows;
};
