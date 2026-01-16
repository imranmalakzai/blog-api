import express from "express";

import * as publicationArticles from "../controllers/article.controller.js";

import { auth } from "../middleware/auth.middleware.js";
import { publicationMember } from "../middleware/loadPublicationRole.middleware.js";
import { validMemeber } from "../middleware/validPublicationMemeber.middleware.js";
import { loadPublication } from "../middleware/loadPublications.middleware.js";
import { requireArticleOwnerIfWriter } from "../middleware/articleOwner.middleware.js";

//publication Article Router
const publicationArtileRouter = express.Router();

//Get all articles
publicationArtileRouter
  .route("/publications/:publicationSlug/articles")
  .get(auth, loadPublication, publicationArticles.paArticles);

//Get article by Id
publicationArtileRouter
  .route("/publications/:publicationSlug/articles/:slug")
  .get(auth, loadPublication, publicationArticles.paArticles);

// Post an article this will be in review state
publicationArtileRouter
  .route("/publications/:publicationSlug/articles")
  .post(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor", "writer")
  );

// delete a publiction article
publicationArtileRouter
  .route("/publications/:publicationSlug/articles/:articleSlug")
  .delete(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "writer"),
    requireArticleOwnerIfWriter,
    publicationArticles.paRemove
  );

// update publication article content only
publicationArtileRouter
  .route("/publications/:publicationId/articles/:articleSlug")
  .patch(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor", "writer"),
    requireArticleOwnerIfWriter,
    publicationArticles.paUpdate
  );
