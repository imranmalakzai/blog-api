import express from "express";
import * as publications from "../controllers/publication.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const publicationRouter = express.Router();

publicationRouter.use(auth);

//create publications
publicationRouter.route("/publications").post(publications.create);

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
  .patch(publications.publication);
