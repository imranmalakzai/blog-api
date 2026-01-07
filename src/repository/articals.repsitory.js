import { pool } from "../config/db.config.js";

/**Create a new article (draft or published)*/
export const createArticle = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO articles 
     (author_id, publication_id, title, slug, excerpt, content, status, visibility, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.author_id,
      data.publication_id || null,
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.status,
      data.visibility,
      data.published_at ? "NOW()" : null,
    ]
  );

  return result.insertId;
};

/**Soft delete article*/
export const deleteArticle = async (articleId) => {
  const [result] = await pool.query(
    `UPDATE articles
     SET deleted_at = NOW()
     WHERE id = ?
       AND deleted_at IS NULL`,
    [articleId]
  );

  return result.affectedRows;
};

/** Get all public published articles*/
export const getPublicArticles = async () => {
  const [rows] = await pool.query(
    `SELECT *
     FROM articles
     WHERE status = 'published'
       AND visibility = 'public'
       AND deleted_at IS NULL`
  );

  return rows;
};

/** Get all articles of current user (non-deleted)*/
export const getMyArticles = async (authorId) => {
  const [rows] = await pool.query(
    `SELECT *
     FROM articles
     WHERE author_id = ?
       AND deleted_at IS NULL`,
    [authorId]
  );

  return rows;
};

/**Change visibility (public | private | unlisted)*/
export const changeArticleVisibility = async (articleId, visibility) => {
  const [result] = await pool.query(
    `UPDATE articles
     SET visibility = ?
     WHERE id = ?
       AND deleted_at IS NULL`,
    [visibility, articleId]
  );

  return result.affectedRows;
};

/** Get archived articles of user */
export const getArchivedArticles = async (authorId) => {
  const [rows] = await pool.query(
    `SELECT *
     FROM articles
     WHERE status = 'archived'
       AND author_id = ?
       AND deleted_at IS NULL`,
    [authorId]
  );

  return rows;
};

/** Publish article */
export const publishArticle = async (articleId) => {
  const [result] = await pool.query(
    `UPDATE articles
     SET status = 'published',
         published_at = NOW()
     WHERE id = ?
       AND status != 'published'
       AND deleted_at IS NULL`,
    [articleId]
  );

  return result.affectedRows;
};

/** Get article by slug (public access) */
export const getArticleBySlug = async (slug) => {
  const [rows] = await pool.query(
    `SELECT *
     FROM articles
     WHERE slug = ?
       AND status = 'published'
       AND visibility IN ('public', 'unlisted')
       AND deleted_at IS NULL
     LIMIT 1`,
    [slug]
  );

  return rows[0] || null;
};

//** GET Draft Articles */
export const getDraftArticles = async (authorId) => {
  const [rows] = await pool.query(
    `SELECT * 
    FROM articles 
    WHERE status = 'draft'
    AND deleted_at IS NULL
    AND author_id = ?
    `,
    [authorId]
  );
  return rows;
};

//** Get article by Id */
export const getArticleById = async (articleId) => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE id = ?",
    articleId
  );
  return rows[0];
};
