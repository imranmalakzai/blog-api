import express from "express";
import * as publications from "../controllers/publication.controller.js";
import { loadPublication } from "../middleware/loadPublications.middleware.js";
import * as schema from "../validation/publication.schema.js";
import { validate } from "../config/zod.config.js";
import { auth } from "../middleware/auth.middleware.js";

//child routes
import publicationArticleRouter from "./publicationArticle.route.js";
import publicationMembersRouter from "./publicationsMemebers.route.js";

const publicationRouter = express.Router({ mergeParams: true });

//create publications
publicationRouter
  .route("/")
  .post(auth, validate(schema.create), publications.create);

//delete publication
publicationRouter
  .route("/:publicationSlug")
  .delete(auth, loadPublication, publications.remove);

//Get all publications
publicationRouter.route("/").get(publications.publications);

//Get a publication by slug
publicationRouter.route("/:publicationSlug").get(publications.publication);

//update a publications
publicationRouter
  .route("/:publicationSlug")
  .patch(loadPublication, validate(schema.update), publications.update);

//nested route endpoints
publicationRouter.use("/:publicationSlug", publicationArticleRouter);
publicationRouter.use("/:publictionSlug", publicationMembersRouter);

export default publicationRouter;
