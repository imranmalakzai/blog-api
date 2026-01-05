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
