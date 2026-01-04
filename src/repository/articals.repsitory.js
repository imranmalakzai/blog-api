import { pool } from "../config/db.config.js";

//** create a new article */
export const userCreatearticle = async (data) => {
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
      data.published_at || null,
    ]
  );
  return result.affectedRows;
};

//** User Delate article */
export const deleteAritical = async (articleId) => {
  const result = await pool.query(
    "UPDATE articles SET deleted_at = NOW()  WHERE id = ?",
    [articleId]
  );
  return result.affectedRows;
};
article;
//
