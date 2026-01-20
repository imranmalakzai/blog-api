import { pool } from "../config/db.config.js";

/**Create a new article (draft or published)*/
export const createArticle = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO articles (author_id,publication_id, title, slug, excerpt, content, status, visibility, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.author_id,
      data.publicationId || null,
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.status,
      data.visibility,
      data.published_at || null,
    ],
  );

  return result.insertId;
};

/**Soft delete article*/
export const deleteArticle = async (articleId, authorId) => {
  const [result] = await pool.query(
    `UPDATE articles
     SET deleted_at = NOW()
     WHERE id = ?
       AND deleted_at IS NULL
       AND author_id = ?
       `,
    [articleId, authorId],
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
       AND deleted_at IS NULL
       AND publication_id IS NULL
       `,
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
    [authorId],
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
    [visibility, articleId],
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
    [authorId],
  );

  return rows;
};

//** update an article */
export const update = async (data) => {
  const result = await pool.query(
    "UPDATE articles SET content = ? , title = ? , excerpt = ?, slug = ? WHERE id = ? AND author_id = ?",
    [
      data.content,
      data.title,
      data.excerpt,
      data.slug,
      data.articleId,
      data.author_id,
    ],
  );
  return result.affectedRows;
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
    [articleId],
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
    [slug],
  );

  return rows[0];
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
    [authorId],
  );
  return rows;
};

//** Get article by Id */
export const getArticleById = async (articleId) => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL",
    articleId,
  );
  return rows[0];
};

//** Get publish public article */
export const article = async (articleId) => {
  const [rows] = await pool.query(
    `SELECT * FROM articles WHERE
     publication_id IS NULL 
     AND deleted_at is NULL
     AND status = 'published'
     AND id = ?
    `,
    [articleId],
  );
  return rows;
};
//**Get publications articles */
export const getPublicationArticles = async (publicationId) => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE publication_id = ? AND status = 'published' AND deleted_at IS NULL AND visibility = 'public' AND published_at IS NOT NULL",
    [publicationId],
  );
  return rows;
};

//**Get a publication article by Id */
export const getAPublicationArticleById = async (publicationId, articleId) => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE publication_id = ? AND id = ? AND deleted_at IS NULL AND status = 'published' ",
    [publicationId, articleId],
  );
  return rows[0];
};

//**Get all published Articles */
export const publishedArticles = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE status = 'published' AND visibility = 'public' AND deleted_at IS NULL",
  );
  return rows;
};

//** user published articles */
export const myArticles = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE status = 'published' AND visibility = 'public' AND deleted_at IS NULL AND publication_id IS NULL AND author_id = ?  ",
    [userId],
  );
  return rows;
};

//**Get under reviewd articles */
export const articleUnderReivew = async (publicatinId) => {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE status = 'review' AND deleted_at is NULL AND publication_id = ?",
    [publicatinId],
  );
  return rows;
};

//** publication publish article under Reviewed */
export const publishReviewdArticle = async (publicationId, articleId) => {
  const result = await pool.query(
    "UPDATE articles SET status = 'published' WHERE publication_id = ? and id = ? ",
    [publicationId, articleId],
  );
  result.affectedRows;
};

//** publication reject under reviewd article */
export const rejectUnderReviewdArticle = async (publicationId, articleId) => {
  const result = await pool.query(
    "UPDATE articles SET status = 'rejected' WHERE publication_id = ? AND article_id = ? AND deleted_at IS NULL",
  );
  return result.affectedRows;
};
