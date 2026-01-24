import express from "express";
import * as reactions from "../controllers/reaction.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { authoriz } from "../middleware/allowedRole.middleware.js";
import * as schema from "../validation/reactions.schema.js";
import { validate } from "../config/zod.config.js";

const reactionRouter = express.Router();

//Get all reactions
reactionRouter.route("/").get(reactions.reactions);

//Get a reaction by Id
reactionRouter.route("/:reactionId").get(reactions.reaction);

//create a new reaction
reactionRouter
  .route("/")
  .post(auth, authoriz("admin"), validate(schema.create), reactions.create);

//update a reactions
reactionRouter
  .route("/:reactionId")
  .post(auth, authoriz("admin"), validate(schema.update), reactions.update);

//delete a reaction
reactionRouter
  .route("/:reactionId")
  .delete(auth, authoriz("admin"), reactions.remove);

export default reactionRouter;
