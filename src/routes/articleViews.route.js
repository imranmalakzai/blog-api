import e from "express";
import * as Views from "../controllers/article_views.controller.js";

const articleViewRouter = e.Router({ mergeParams: true });

// articles/:articleSlug/views
articleViewRouter.route("/").get(Views.articleViews);

export default articleViewRouter;
