import express from "express";
import * as tags from "../controllers/tags.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { authoriz } from "../middleware/allowedRole.middleware.js";
import * as schema from "../validation/tags.schema.js";
import { validate } from "../config/zod.config.js";

const tagsRouter = express.Router();

//create tag
tagsRouter
  .route("/")
  .post(auth, authoriz("admin"), validate(schema.create), tags.create);

//delete tag slug
tagsRouter.route("/:slug").delete(auth, authoriz("admin"), tags.remove);

//get all tags
tagsRouter.route("/").get(tags.tags);

//get a tag by slug
tagsRouter.route("/:slug").get(tags.tag);

//update a tag
tagsRouter.route("/:slug").patch(validate(schema.update), tags.update);

export default tagsRouter;
