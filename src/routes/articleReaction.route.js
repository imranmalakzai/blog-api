import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as articleReaction from "../controllers/article_reactions.controller.js";

const articleReactionRouter = express.Router({ mergeParams: true });

articleReactionRouter.route("/").post(auth, articleReaction.create);
articleReaction.route("/").get(auth, articleReaction.likes);

export default articleReactionRouter;
