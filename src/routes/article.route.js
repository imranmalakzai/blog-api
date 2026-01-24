import express from "express";
import * as article from "../controllers/article.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import * as schema from "../validation/articles.schema.js";
import { validate } from "../config/zod.config.js";
import { articleMiddleware } from "../middleware/article.middleware.js";

//import child routes
import commentRouter from "./comments.route.js";
import articleReactionRouter from "./articleReaction.route.js";
import articleViewRouter from "./articleViews.route.js";
//**Router endpoints */
const articleRouter = express.Router();

//** global route endpoints */

//create article
articleRouter.route("/").post(auth, validate(schema.create), article.create);

articleRouter.route("/").get(article.articles);

//get article by slug
articleRouter.route("/:articleSlug").get(articleMiddleware, article.article);

//update article
articleRouter
  .route("/:articleSlug")
  .patch(auth, articleMiddleware, validate(schema.update), article.update);

articleRouter
  .route("/:articleSlug")
  .delete(auth, articleMiddleware, article.remove);

//** Nested endpoints */

// article comments
articleRouter.use("/:articleSlug/comments", articleMiddleware, commentRouter);

// article Reactions
articleRouter.use(
  "/:articleSlug/reactions",
  articleMiddleware,
  articleReactionRouter,
);

// article Views
articleRouter.use("/:articleSlug/views", articleMiddleware, articleViewRouter);

export default articleRouter;
