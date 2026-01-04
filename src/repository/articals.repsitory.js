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

//** User Delate Artical */
export const deleteAritical = async (articalId) => {
  const result = await pool.query(
    "UPDATE articles SET deleted_at = NOW()  WHERE id = ?",
    [articalId]
  );
  return result.affectedRows;
};
