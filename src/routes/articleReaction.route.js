import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as articleReaction from "../controllers/article_reactions.controller.js";
import { validate } from "../config/zod.config.js";
import * as schema from "../validation/articleReaction.schema.js";

const articleReactionRouter = express.Router({ mergeParams: true });

articleReactionRouter
  .route("/")
  .post(auth, validate(schema.react), articleReaction.react);
articleReactionRouter.route("/").get(articleReaction.likes);

export default articleReactionRouter;
