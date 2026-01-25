import slugify from "slugify";
import { nanoid } from "nanoid";
import { NOTIFICATION_TYPES } from "../constant/notification.js";
import * as Notification from "../repository/notification.repository.js";
import * as Db from "../repository/articals.repsitory.js";
import * as view from "../repository/article_views.repository.js";
import * as userDb from "../repository/users.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

//** Person Articles crud */

//** Create new article */
export const create = asyncHandler(async (req, res) => {
  const { title, excerpt, content, status, visibility } = req.body;

  //add unique slug
  const slug = slugify(title, { lower: true, strict: true }) + "-" + nanoid(5);

  if (status === "published") {
    //create article
    const article = await Db.createArticle({
      author_id: req.user.id,
      title,
      excerpt,
      status,
      content,
      slug,
      visibility,
      published_at: new Date(),
    });
    if (article === 0) throw new ApiError("Internal server error", 500);
    await Notification({
      user_id: req.user.id,
      actor_id: null,
      type: NOTIFICATION_TYPES.ARTICLE_PUBLISH,
      entity_id: article,
    });
    return res.status(200).json({ message: "Article published successfully" });
  }

  //create article in drift
  const article = await Db.createArticle({
    author: req.user.id,
    title,
    slug,
    excerpt,
    content,
    status,
    visibility,
    published_at: false,
  });
  if (article === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article created successfully" });
});

//** delete article */
export const remove = asyncHandler(async (req, res) => {
  //is owner of the article admin
  const owner = req.article.author_id.toString() === req.user.id.toString();
  const admin = req.user.role === "admin";

  if (!owner && !admin) throw new ApiError("Access denied", 403);

  const result = await Db.deleteArticle(req.article.id, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article deleted successfully" });
});

//**Get all public published articles */
export const articles = asyncHandler(async (req, res) => {
  const articles = await Db.getPublicArticles();
  res.status(200).json({ articles: articles || [] });
});

//** Get an article by slug*/
export const article = asyncHandler(async (req, res) => {
  const result = await view.viewedArticle(req.article.id, req.user.id);
  if (!result)
    await view.create({
      ip_address: req.ip,
      user_id: req.user.id,
      article_id: req.article.id,
    });

  res.status(200).json({ article: req.article });
});

//** Update an article */
export const update = asyncHandler(async (req, res) => {
  const { title, excerpt, content } = req.body;

  //add unique slug
  const slug = slugify(title, { lower: true, strict: true }) + "-" + nanoid(5);

  //is owner
  const owner = req.user.id.toString() === req.article.author_id.toString();

  const editor = req.user.role === "editor";
  if (!owner && !editor) throw new ApiError("Access denied", 403);

  // result
  const result = await Db.update({
    author_id: req.user.id,
    content,
    title,
    excerpt,
    slug,
    articleId: article.id,
  });
  if (result === 0) throw new ApiError("Internal server error", 500);
  res.status(200).json({ message: "Article updated successfully" });
});

//** user articles */
export const userArticles = async (req, res) => {
  const { username } = req.params;

  //user exist
  const user = await userDb.getUserByUsername(username);
  if (!user) throw new ApiError("user not exist", 404);

  const articles = await Db.myArticles(user.id);
  res.status(200).json({ articles });
};

//**user article by Id */
export const userArticle = async (req, res) => {
  const { username } = req.params;
  const { articleId } = req.params;

  //user exist
  const user = await userDb.getUserByUsername(username);
  if (!user) throw new ApiError("user not exist", 404);

  const article = await Db.getArticleById(articleId);
  if (!article) throw new ApiError("article not exist", 404);

  const owner = (await article.author_id.toString()) === user.id.toString();
  if (!owner) throw new ApiError("Access Denied", 403);

  res.status(200).json({ article });
};

//**Publication articles Part */
export const paCreate = asyncHandler(async (req, res) => {
  const { title, excerpt, content, status, visibility } = req.body;

  //add unique slug
  const slug = slugify(title, { lower: true, strict: true }) + "-" + nanoid(5);

  if (status === "published") {
    //create article
    const article = await Db.createArticle({
      publicationId: req.publication.id,
      author_id: req.user.id,
      title,
      excerpt,
      content,
      slug,
      status: req.publicationRole === "writer" ? "review" : status,
      visibility,
      published_at: req.publicationRole !== "writer" ? new Date() : null,
    });

    if (article === 0) throw new ApiError("Internal server error", 500);

    //Notification
    if (req.publicationRole !== "writer") {
      await Notification.create({
        user_id: req.user.id,
        actor_id: null,
        type: NOTIFICATION_TYPES.ARTICLE_PUBLISH,
        entity_id: article,
      });
    }

    return res.status(201).json({
      message:
        req.publicationRole === "writer"
          ? "article is pending wait to approve"
          : "article published successfully",
    });
  }

  //create article in drift
  const article = await Db.createArticle({
    publicationId: req.publication.id,
    author: req.user.id,
    title,
    slug,
    excerpt,
    content,
    status,
    visibility,
    published_at: false,
  });
  if (article === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article created successfully" });
});

//**publicationa article delete */
export const paRemove = asyncHandler(async (req, res) => {
  if (req.article.publication_id.toString() !== req.publication.id.toString()) {
    throw new ApiError("Article not belongs to publication", 403);
  }
  const result = await Db.deleteArticle(req.article.id, req.user.id);
  if (result === 0) throw new ApiError("internal server error", 500);

  res.status(200).json({ message: "Article deleted successfully" });
});

//**Get all article of publication */
export const paArticles = asyncHandler(async (req, res) => {
  //articles
  const articles = await Db.getPublicationArticles(req.publication.id);

  res.status(200).json({ article: articles || [] });
});

//** publication article by slug */
export const paArticle = asyncHandler(async (req, res) => {
  if (req.article.publication_id.toString() !== req.publication.id.toString()) {
    throw new ApiError("Article not belongs to publication", 403);
  }
  const result = await view.viewedArticle(req.article.id, req.user.id);
  if (!result)
    await view.create({
      ip_address: req.ip,
      user_id: req.user.id,
      article_id: req.article.id,
    });

  res.status(200).json({ article: req.article });
});

//** publication article update */
export const paUpdate = asyncHandler(async (req, res) => {
  if (req.article.publication_id.toString() !== req.publication.id.toString()) {
    throw new ApiError("Article not belongs to publication", 403);
  }
  const { title, excerpt, content } = req.body;
  const slug =
    slugify(title, { lower: true, trim: true, strict: true }) + "-" + nanoid(5);
  const result = await Db.update({
    author_id: req.user.id,
    content,
    title,
    excerpt,
    slug,
    articleId: req.article.id,
  });
  if (result === 0) throw new ApiError("Internal server error", 500);
  res.status(200).json({ message: "Article updated successfully" });
});

//** My articles */
export const myArticles = asyncHandler(async (req, res) => {
  const myArticle = await Db.myArticles(req.user.id);
  res.status(200).json({ myArticle });
});

//** Reivewd article */
export const paReview = asyncHandler(async (req, res) => {
  const articles = await Db.articleUnderReivew(req.publication.id);
  res.status(200).json({ articles: articles || [] });
});

//** publicdation publish under reviewd article */
export const paPublish = asyncHandler(async (req, res) => {
  const { articleSlug } = req.params;

  //articl exist
  const article = await Db.getUnderReviewArticleBySlug({
    articleSlug,
    publicationId: req.publication.id,
  });
  if (!article) throw new ApiError("Article not exist in review", 404);

  //result
  const result = await Db.publishReviewdArticle(req.publication.id, article.id);

  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "published article successfully" });
});

//** Reject under review article */
export const PaReject = asyncHandler(async (req, res) => {
  const { articleSlug } = req.params;
  const article = await Db.getUnderReviewArticleBySlug({
    articleSlug,
    publicationId: req.publication.id,
  });

  if (!article || !article.status === "review") {
    throw new ApiError("article not exist or not under reivew", 403);
  }
  //result
  const result = await Db.rejectUnderReviewdArticle(
    req.publication.id,
    article.id,
  );
  if (result === 0) throw new ApiError("Internal server error", 500);
  res.status(200).json({ message: "Article rejected" });
});
