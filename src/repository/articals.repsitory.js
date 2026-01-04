import { pool } from "../config/db.config.js";

//** create a new article */
export const userCreateArticle = async (data) => {
  const result = await pool.query(
    "INSERT INTO articles (author_id,putlication_id,title,slug,excerpt,content,status,visibility,published_at) VALUES (?,?,?,?,?,?,?,?,?)",
    [
      data.author_id,
      data.publication_id,
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.status,
      data.visibility,
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

//**Get all public articles */
export const GetPublicArticles = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE visibility = ?",
    ["public"]
  );
  return rows;
};
