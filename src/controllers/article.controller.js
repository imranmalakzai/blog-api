import slugify from "slugify";
import { NOTIFICATION_TYPES } from "../constant/notification.js";
import * as Notification from "../repository/notification.repository.js";
import * as Db from "../repository/articals.repsitory.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

//** Person Articles crud */

//** Create new article */
export const create = asyncHandler(async (req, res) => {
  const { title, excerpt, content, status, visibility } = req.body;
  const slug = slugify(title, { strict: true, trim: true, lower: true });

  if (status === "published") {
    //create article
    const article = await Db.createArticle({
      author: req.user.id,
      title,
      excerpt,
      content,
      slug,
      status,
      visibility,
      published_at: true,
    });

    if (!article.lenght) throw new ApiError("Internal server error", 500);
    await Notification({
      user_id: req.user.id,
      actor_id: null,
      type: NOTIFICATION_TYPES.ARTICLE_PUBLISH,
      entity_id: article,
    });
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
  if (!article.lenght) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article created successfully" });
});

//** delete article */
export const remove = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await Db.getArticleById(articleId);
  if (!article) throw new ApiError("Article not exist", 404);

  //is owner of the article
  if (article.author_id.toString() !== req.user.id.toString()) {
    throw new ApiError("Access Denied", 403);
  }

  const result = await Db.deleteArticle(article.id, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article deleted successfully" });
});

//**Get all public published articles */
export const articles = asyncHandler(async (req, res) => {
  const articles = await Db.getPublicArticles();
  res.status(200).json({ articles: articles || [] });
});

//** Get an article by Id */
export const article = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  //const article exist
  const article = await Db.article(articleId);
  if (!article.lenght) throw new ApiError("Internal server error", 500);
});
