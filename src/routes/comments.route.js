import express from "express";
import * as comment from "../controllers/comments.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import * as schema from "../validation/comment.schema.js";
import { validate } from "../config/zod.config.js";

const commentRouter = express.Router();

//create a comment
commentRouter
  .route("/articles/:articleSlug/comments")
  .post(auth, validate(schema.create), comment.create);

// Get all comments
commentRouter.route("/articles/:articleSlug/comments").get(comment.comments);

//get a comment
commentRouter
  .route("/articles/:articleSlug/comments/:commentId")
  .get(comment.comment);

//delete a comment
commentRouter
  .route("/articles/:articleSlug/comments/:commentId")
  .delete(auth, comment.remove);

//update a comment
commentRouter
  .route("/articles/:articleSlug/comments/:commentId")
  .patch(comment.update);
