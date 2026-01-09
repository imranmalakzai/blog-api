import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  createNewArticle,
  publictionArticles,
  deletePublicationArticle as deleteArticle,
  publicationArticle,
  userArticle,
  articleDelete,
  getPublishedArticles,
  userArticles,
  getUserArticleById,
} from "../controllers/articles.controller.js";

const articleRouter = express.Router({ mergeParams: true });
articleRouter.use(auth);

//** Publication Articles */
articleRouter
  .route("publication/:publicationId/articles")
  .post(createNewArticle);
articleRouter
  .route("publication/:publicationId/articles")
  .get(publictionArticles);
articleRouter
  .route("publication/:publicationId/articles/:articleId")
  .delete(deleteArticle);
articleRouter
  .route("publication/:publicationId/articles/:articleId")
  .get(publicationArticle);
articleRouter
  .route("publication/:publicationSlug-:publicationId/articles")
  .get(publictionArticles);
articleRouter
  .route(
    "publication/:publicationSlug-:publicationId/articles/:articleSlug-:articleId"
  )
  .get(publicationArticle);

//** Public Independent personal articles */
articleRouter.route("articles").get(getPublishedArticles);
articleRouter.route("articles/:articleSlug-:articleId").get(userArticle);
articleRouter.route("articles/:articleId").get(userArticle);
articleRouter.route("articles/:articleId").delete(articleDelete);

//** Get artile by username */
articleRouter.route("users/@:username-:userId/articles").get(userArticles);
articleRouter
  .route("users/@:username-:userId/articles/:articleSlug-:articleId")
  .get(getUserArticleById);
