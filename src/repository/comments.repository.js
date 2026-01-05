import { pool } from "../config/db.config.js";

//** create a comment */
export const createComment = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO comments (article_id,user_id,parent_id,content,is_deleted) VALUES (?,?,?,?,?)`,
    [
      data.article_id,
      data.user_id,
      data.parent_id || null,
      data.content,
      data.is_deleted || 0,
    ]
  );
  return result.insertId;
};

//** Update a comment */
export const updateComment = async (content, commentId) => {
  const result = await pool.query(
    `UPDATE comments SET content = ? WHERE is_deleted = '0' AND id = ?`,
    [content, commentId]
  );
  return result.affectedRows;
};

//** soft delete comment */
export const deleteComment = async (commentId) => {
  const result = await pool.query(
    "UPDATE comments SET is_deleted = '0' WHERE is_deleted = '1' AND id = ? ",
    [commentId]
  );
  return result.affectedRows;
};

//**Get  all comments of on article */
export const articleComments = async (articleId) => {
  const [rows] = await pool.query(
    "SELECT * FROM comments WHERE article_id = ?",
    [articleId]
  );
  return rows;
};
