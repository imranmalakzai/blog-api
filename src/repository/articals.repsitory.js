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

//**Get all my articles */
export const getMyArticles = async (authorId) => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE author_id =  ?",
    [authorId]
  );
  return rows;
};

//**Change visiblity of an article */
export const changeVisibility = async (articleId, visibility) => {
  const result = await pool.query(
    "UPDATE articles SET visibility = ?, WHERE id = ?",
    [visibility, articleId]
  );
  return result.affectedRows;
};

//**Get archive articles */
export const getArchiveArticles = async (authorId) => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE status = ? AND author_id = ? AND deleted_at IS NULL",
    ["archived", authorId]
  );
  return rows;
};
