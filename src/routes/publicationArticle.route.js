import express from "express";

import * as publicationArticles from "../controllers/article.controller.js";
import * as schema from "../validation/articles.schema.js";
import { validate } from "../config/zod.config.js";
import { publicationMember } from "../middleware/loadPublicationRole.middleware.js";
import { validMemeber } from "../middleware/validPublicationMemeber.middleware.js";
import { articleMiddleware } from "../middleware/article.middleware.js";
import { requireArticleOwnerIfWriter } from "../middleware/articleOwner.middleware.js";
//child route
import commentRouter from "./comments.route.js";
import articleReaction from "./articleReaction.route.js";

//publication Article Router
const publicationArticleRouter = express.Router({ mergeParams: true });

//Get all articles
publicationArticleRouter.route("/articles").get(publicationArticles.paArticles);

//Get article with slug
publicationArticleRouter
  .route("/articles/:articleSlug")
  .get(articleMiddleware, publicationArticles.paArticles);

// Post an article this will be in review for writers state
publicationArticleRouter
  .route("/articles/")
  .post(
    publicationMember,
    validMemeber("owner", "editor", "writer"),
    validate(schema.create),
    publicationArticles.paCreate,
  );

// delete a publiction article
publicationArticleRouter
  .route("/articles/:articleSlug")
  .delete(
    publicationMember,
    validMemeber("owner", "writer"),
    requireArticleOwnerIfWriter,
    publicationArticles.paRemove,
  );

// update publication article content only
publicationArticleRouter
  .route("/articles/:articleSlug")
  .patch(
    publicationMember,
    validMemeber("owner", "editor", "writer"),
    requireArticleOwnerIfWriter,
    publicationArticles.paUpdate,
  );

// under review articles
publicationArticleRouter
  .route("/review-articles")
  .get(
    publicationMember,
    validMemeber("owner", "editor"),
    publicationArticles.paReview,
  );

// Publish article or approve article
publicationArticleRouter
  .route("/review-articles/:articleSlug/approve")
  .patch(
    publicationMember,
    validMemeber("owner", "editor"),
    publicationArticles.paPublish,
  );

// Reject an article
publicationArticleRouter
  .route("/articles/:articleSlug/reject")
  .patch(
    publicationMember,
    validMemeber("editor", "owner", "writer"),
    requireArticleOwnerIfWriter,
    publicationArticles.PaReject,
  );

//nested route
publicationArticleRouter.use(
  "/articles/:articleSlug/comments",
  articleMiddleware,
  commentRouter,
);

publicationArticleRouter.use(
  "/articles/:articleSlug/reactions",
  articleMiddleware,
  articleReaction,
);

export default publicationArticleRouter;
