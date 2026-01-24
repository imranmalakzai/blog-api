import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as bookmarks from "../controllers/bookmarks.controller.js";
import { articleMiddleware } from "../middleware/article.middleware.js";

const bookmarksRouter = express.Router();

bookmarksRouter.use(auth);

// bookmark article
bookmarksRouter
  .route("/articles/:articleSlug")
  .post(articleMiddleware, bookmarks.create);

// fetch a bookmark article
bookmarksRouter
  .route("/articles/:articleSlug")
  .get(articleMiddleware, bookmarks.bookmark);

// remove bookmarked article
bookmarksRouter
  .route("/articles/:articleSlug")
  .delete(articleMiddleware, bookmarks.remove);

// user bookmark
bookmarksRouter.route("/").get(bookmarks.bookmarks);

export default bookmarksRouter;
