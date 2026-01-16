import express from "express";
import * as reactions from "../controllers/article_reactions.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { loadPublication } from "../middleware/loadPublications.middleware.js";

const publicationArticleReactionRouter = express.Router({ mergeParams: true });

publicationArticleReactionRouter
  .route("/reaction")
  .post(auth, loadPublication, reactions.create);

publicationArticleReactionRouter
  .route("/reaction")
  .get(auth, loadPublication, reactions.likes);

export default publicationArticleReactionRouter;
