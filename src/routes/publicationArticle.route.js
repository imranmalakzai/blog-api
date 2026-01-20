import express from "express";

import * as publicationArticles from "../controllers/article.controller.js";

import { auth } from "../middleware/auth.middleware.js";
import { publicationMember } from "../middleware/loadPublicationRole.middleware.js";
import { validMemeber } from "../middleware/validPublicationMemeber.middleware.js";
import { loadPublication } from "../middleware/loadPublications.middleware.js";
import { requireArticleOwnerIfWriter } from "../middleware/articleOwner.middleware.js";

//publication Article Router
const publicationArticleRouter = express.Router();

//Get all articles
publicationArticleRouter
  .route("/publications/:publicationSlug/articles")
  .get(auth, loadPublication, publicationArticles.paArticles);

//Get article by Id
publicationArticleRouter
  .route("/publications/:publicationSlug/articles/:slug")
  .get(auth, loadPublication, publicationArticles.paArticles);

// Post an article this will be in review state
publicationArticleRouter
  .route("/publications/:publicationSlug/articles")
  .post(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor", "writer"),
    publicationArticles.paCreate,
  );

// delete a publiction article
publicationArticleRouter
  .route("/publications/:publicationSlug/articles/:articleSlug")
  .delete(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "writer"),
    requireArticleOwnerIfWriter,
    publicationArticles.paRemove,
  );

// update publication article content only
publicationArticleRouter
  .route("/publications/:publicationId/articles/:articleSlug")
  .patch(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor", "writer"),
    requireArticleOwnerIfWriter,
    publicationArticles.paUpdate,
  );

// under review articles
publicationArticleRouter
  .route("/publications/:publicationId/articles/review")
  .get(
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor"),
    publicationArticles.paReview,
  );

// Publish article or approve article
publicationArticleRouter
  .route("/publications/:publicationId/articles/:articleSlug/aprove")
  .patch(
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor"),
    publicationArticles.paPublish,
  );

// Reject an article
publicationArticleRouter
  .route("publications/:publicationId/articles/:articleSlug/reject")
  .patch(
    loadPublication,
    publicationMember,
    validMemeber("editor", "owner", "writer"),
    requireArticleOwnerIfWriter,
    publicationArticles.PaReject,
  );

export default publicationArticleRouter;
