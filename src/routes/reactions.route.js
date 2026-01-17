import express from "express";
import * as reactions from "../controllers/reaction.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { authoriz } from "../middleware/allowedRole.middleware.js";

const reactionRouter = express.Router();

//Get all reactions
reactionRouter.route("/reactions").get(reactions.reactions);

//Get a reaction by Id
reactionRouter.route("/reactions/:reactionId").get(reactions.reaction);

//create a new reaction
reactionRouter
  .route("/reactions")
  .post(auth, authoriz("admin"), reactions.create);

//update a reactions
reactionRouter
  .route("/reactions/:reactionId")
  .post(auth, authoriz("admin"), reactions.update);

//delete a reaction
reactionRouter.route(
  "/reactions/:reactionId",
  auth,
  authoriz("admin"),
  reactions.remove
);

export default reactionRouter;
