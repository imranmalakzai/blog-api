import { pool } from "../config/db.config.js";
//**Create article view  */
export const create = async (data) => {
  const [rows] = await pool.query(
    "INSERT INTO article_views (article_id,user_id,ip_address,read_time) VALUES (?,?,?,?)",
    [data.article_id, data.user_id, data.ip_address, data.read_time]
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
