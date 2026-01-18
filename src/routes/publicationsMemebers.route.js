import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { loadPublication } from "../middleware/loadPublications.middleware.js";
import * as publication from "../controllers/publication_memeber.controller.js";
import { publicationMember } from "../middleware/loadPublicationRole.middleware.js";
import { validMemeber } from "../middleware/validPublicationMemeber.middleware.js";
import * as schema from "../validation/publicationMemebers.js";
import { validate } from "../config/zod.config.js";

const publicationMembersRouter = express.Router();

//follow publications
publicationMembersRouter
  .route("/publications/:publicationSlug/follow")
  .post(auth, loadPublication, publication.create);

//unfollow publications
publicationMembersRouter
  .route("/publications/:publicationSlug/follow")
  .delete(auth, loadPublication, publication.remove);

//followers
publicationMembersRouter
  .route("/publications/:publicationSlug/followers")
  .get(auth, loadPublication, publication.followers);

//memebers
publicationMembersRouter
  .route("/publications/:publicationSlug/memebers")
  .get(auth, loadPublication, publication.memebers);

//remove a memeber from publication
publicationMember
  .route("/publications/:publicationSlug/memebers/:userId")
  .delete(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("admin"),
    publication.removeUser
  );

//change memebership
publicationMembersRouter
  .route("/publications/:publicationSlug/memebers/:userId")
  .patch(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("admin"),
    validate(schema.role),
    publication.changeRole
  );

export default publicationMembersRouter;
