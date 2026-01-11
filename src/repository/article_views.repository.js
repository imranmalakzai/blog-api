import { pool } from "../config/db.config.js";
//**Create article view  */
export const create = async (data) => {
  const [rows] = await pool.query(
    "INSERT INTO article_views (article_id,user_id,ip_address,read_time) VALUES (?,?,?,?)",
    [data.article_id, data.user_id, data.ip_address, data.read_time]
  );
  return rows;
};
