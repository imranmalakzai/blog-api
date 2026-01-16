import express from "express";
import * as article from "../controllers/article.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { publicationMember } from "../middleware/loadPublicationRole.middleware.js";
import { loadPublication } from "../middleware/loadPublications.middleware.js";
import { validMemeber } from "../middleware/validPublicationMemeber.middleware.js";

//**Router endpoints */
const articleRouter = express.Router();

//** global route endpoints */

articleRouter.route("/articles").post(auth, article.create);
articleRouter.route("/articles").get(article.articles);
articleRouter.route("/articles/:articleSlug").get(article.article);
articleRouter.route("/articles/:articleSlug").patch(auth, article.update);
articleRouter.route("/articles/:articleSlug").delete(auth, article.remove);

//** publiction route endpoints */

//create
articleRouter
  .route("/publications/:publicationSlug/articles")
  .post(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor", "writer"),
    article.paArticle
  );

//featch all
articleRouter
  .route("/publications/:publicationSlug/articles")
  .get(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor", "writer"),
    article.paArticles
  );

//featch by slug
articleRouter
  .route("/publications/:publicationSlug/articles/:articleSlug")
  .get(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "editor", "writer"),
    article.paArticle
  );

//delete by slug
articleRouter
  .route("/publications/:publicationSlug/articles/:articleSlug")
  .delete(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "writer"),
    article.paRemove
  );

//update by slug
articleRouter
  .route("/publications/:publicationSlug/articles/:articleSlug")
  .patch(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner", "writer"),
    article.paUpdate
  );
