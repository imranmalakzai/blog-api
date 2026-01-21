import express from "express";
import * as article from "../controllers/article.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import * as schema from "../validation/articles.schema.js";
import { validate } from "../config/zod.config.js";

//**Router endpoints */
const articleRouter = express.Router();

//** global route endpoints */

//create article
articleRouter.route("/").post(auth, validate(schema.create), article.create);

articleRouter.route("/").get(article.articles);

//get article by slug
articleRouter.route("/:articleSlug").get(article.article);

//update article
articleRouter
  .route("/:articleSlug")
  .patch(auth, validate(schema.update), article.update);

articleRouter.route("/:articleSlug").delete(auth, article.remove);

export default articleRouter;
