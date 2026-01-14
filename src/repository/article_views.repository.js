import { pool } from "../config/db.config.js";
//**Create article view  */
export const create = async (data) => {
  const [rows] = await pool.query(
    "INSERT INTO article_views (article_id,user_id,ip_address,) VALUES (?,?,?,?)",
    [data.article_id, data.user_id, data.ip_address]
  );
  return rows;
};

//**Get an article total viwes */
export const articleViews = async (articleId) => {
  const [rows] = await pool.query(
    "SELECT count(*) As total FROM article_views WHERE article_id = ?",
    articleId
  );
  return rows[0].total;
};

//**Get an article view */
export const viewedArticle = async (articleId, userId) => {
  const [rows] = await pool.query(
    "SELECT id from article_views WHERE article_id = ? and user_id = ? AND created_at = NOW() - INTERVAL 24 HOURS"
  );
  return rows[0];
};
