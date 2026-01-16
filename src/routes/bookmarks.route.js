import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as bookmarks from "../controllers/bookmarks.controller.js";

const bookmarksRouter = express.Router();

bookmarksRouter.use(auth);
bookmarksRouter.route("/bookmarks/articles/:id").post(bookmarks.create);
bookmarksRouter.route("/bookmarks/articles/:id").get(bookmarks.bookmark);
bookmarksRouter.route("/bookmarks/articles/:id").delete(bookmarks.remove);
bookmarksRouter.route("/bookmarks").get(bookmarks.bookmarks);

export default bookmarksRouter;
