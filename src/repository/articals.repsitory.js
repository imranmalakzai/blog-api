import { pool } from "../config/db.config.js";

//** create a new artical */
export const userCreateArtical = async (data) => {
  const result = await pool.query(
    "INSERT INTO articles (author_id,putlication_id,title,slug,excerpt,content,status,visibility,published_at) VALUES (?,?,?,?,?,?,?,?,?)",
    [
      data.author_id,
      data.puglication_id,
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.status,
      data.visisbility,
      data.published_at || Null,
    ]
  );
  return result.affectedRows;
};
