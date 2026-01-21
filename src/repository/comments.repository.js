import { pool } from "../config/db.config.js";

//** create a comment */
export const createComment = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO comments (article_id,user_id,parent_id,content) VALUES (?,?,?,?,?)`,
    [data.article_id, data.user_id, data.parent_id || null, data.content],
  );
  return result.insertId;
};

//** Update a comment */
export const updateComment = async (content, commentId) => {
  const result = await pool.query(
    `UPDATE comments SET content = ? WHERE is_deleted = '0' AND id = ?`,
    [content, commentId],
  );
  return result.affectedRows;
};

//** soft delete comment */
export const deleteComment = async (commentId) => {
  const result = await pool.query(
    "UPDATE comments SET is_deleted = '0' WHERE is_deleted = '1' AND id = ? ",
    [commentId],
  );
  return result.affectedRows;
};

//**Get  all comments of on article */
export const articleComments = async (articleId) => {
  const [rows] = await pool.query(
    "SELECT c.content,u.username,u.avatar_url FROM  comments c JOIN users u ON u.id = c.user_id WHERE c.article_id = ? AND c.is_deleted = '0'",
    [articleId],
  );
  return rows;
};

//**Get a comment by Id */
export const getCommentById = async (commentId) => {
  const [rows] = await pool.query(
    "SELECT * FROM comments WHERE id = ? AND is_deleted = '1' ",
    [commentId],
  );
  return rows[0];
};
