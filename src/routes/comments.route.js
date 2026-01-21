import express from "express";
import * as comment from "../controllers/comments.controller.js";
import * as schema from "../validation/comment.schema.js";
import { commentMiddleware } from "../middleware/comment.middleware.js";
import { validate } from "../config/zod.config.js";

const commentRouter = express.Router({ mergeParams: true });

//create a comment
commentRouter.route("/").post(validate(schema.create), comment.create);

// Get all comments
commentRouter.route("/").get(comment.comments);

//get a comment
commentRouter.route("/:commentId").get(commentMiddleware, comment.comment);

//delete a comment
commentRouter.route("/:commentId").delete(commentMiddleware, comment.remove);

//update a comment
commentRouter
  .route("/:commentId")
  .patch(commentMiddleware, validate(schema.update), comment.update);

export default commentRouter;
