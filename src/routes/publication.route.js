import express from "express";
import * as publications from "../controllers/publication.controller.js";
import { loadPublication } from "../middleware/loadPublications.middleware.js";
import * as schema from "../validation/publication.schema.js";
import { validate } from "../config/zod.config.js";
import { auth } from "../middleware/auth.middleware.js";

const publicationRouter = express.Router();

//create publications
publicationRouter
  .route("/publications")
  .post(auth, validate(schema.create), publications.create);

//delete publication
publicationRouter
  .route("/publications/:publicationSlug")
  .delete(publications.remove);

//Get all publications
publicationRouter.route("/publications").get(publications.publications);

//Get a publication by slug
publicationRouter
  .route("/publications/:publicationSlug")
  .get(publications.publication);

//update a publications
publicationRouter
  .route("/publications/:publicationSlug")
  .patch(loadPublication, validate(schema.update), publications.update);

export default publicationRouter;
