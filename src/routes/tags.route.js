import express from "express";
import * as tags from "../controllers/tags.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { authoriz } from "../middleware/allowedRole.middleware.js";

const tagsRouter = express.Router();

//create tag
tagsRouter.route("/tags").post(auth, authoriz("admin"), tags.create);

//delete tag slug
tagsRouter.route("/tags/:slug").delete(auth, authoriz("admin"), tags.remove);

//get all tags
tagsRouter.route("/tags").get(tags.tag);

//get a tag by slug
tagsRouter.route("/tags/:slug").get(tags.tag);

//update a tag
tagsRouter.route("/tags/:slug").patch(tags.update);

export default tagsRouter;
