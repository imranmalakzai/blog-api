import { pool } from "../config/db.config.js";

//** Add tags in article */
export const create = async (articleId, tagId) => {
  const [result] = await pool.query(
    "INSERT INTO article_tags (article_id,tag_id) VALUES (?,?)",
    [articleId, tagId]
  );
  return result.insertId;
};
