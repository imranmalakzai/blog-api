import e from "express";
import * as Views from "../controllers/article_views.controller.js";

const articleViewRouter = e.Router();

//Get all views
articleViewRouter.route("/articles/:articleSlug", Views.articleViews);

export default articleViewRouter;
