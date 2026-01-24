import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as bookmarks from "../controllers/bookmarks.controller.js";
import { articleMiddleware } from "../middleware/article.middleware.js";

const bookmarksRouter = express.Router();

bookmarksRouter.use(auth);

bookmarksRouter
  .route("/bookmarks/articles/:articleSlug")
  .post(articleMiddleware, bookmarks.create);
bookmarksRouter
  .route("/bookmarks/articles/:articleSlug")
  .get(articleMiddleware, bookmarks.bookmark);
bookmarksRouter
  .route("/bookmarks/articles/:articleSlug")
  .delete(articleMiddleware, bookmarks.remove);
bookmarksRouter.route("/bookmarks").get(bookmarks.bookmarks);

export default bookmarksRouter;
