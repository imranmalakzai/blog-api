import express from "express";
import * as article from "../controllers/article.controller.js";
import { auth } from "../middleware/auth.middleware.js";

//**Router endpoints */
const articleRouter = express.Router();

//** global route endpoints */

articleRouter.route("/articles").post(auth, article.create);
articleRouter.route("/articles").get(article.articles);
articleRouter.route("/articles/:articleSlug").get(article.article);
articleRouter.route("/articles/:articleSlug").patch(auth, article.update);
articleRouter.route("/articles/:articleSlug").delete(auth, article.remove);

export default articleRouter;
