import { pool } from "../config/db.config.js";
import ApiError from "../utils/apiError.js";

//** bookmarks on article */
export const create = async (articleId, userId) => {
  const [result] = await pool.query(
    "INSERT INTO bookmarks (article_id,user_id) VALUES  (?,?)",
    [articleId, userId]
  );
  return result.insertId;
};
