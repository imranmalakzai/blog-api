import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { loadPublication } from "../middleware/loadPublications.middleware.js";
import * as publication from "../controllers/publication_memeber.controller.js";
import { publicationMember } from "../middleware/loadPublicationRole.middleware.js";
import { validMemeber } from "../middleware/validPublicationMemeber.middleware.js";
import * as schema from "../validation/publicationMemebers.js";
import { validate } from "../config/zod.config.js";

const publicationMembersRouter = express.Router({ mergeParams: true });

//follow publications
publicationMembersRouter
  .route("/follow")
  .post(auth, loadPublication, publication.create);

//unfollow publications
publicationMembersRouter
  .route("/follow")
  .delete(auth, loadPublication, publication.remove);

//followers
publicationMembersRouter
  .route("/followers")
  .get(auth, loadPublication, publication.followers);

//memebers
publicationMembersRouter
  .route("/members")
  .get(auth, loadPublication, publication.memebers);

//remove a memeber from publication
publicationMembersRouter
  .route("/members/:username")
  .delete(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner"),
    publication.removeUser,
  );

//change memebership
publicationMembersRouter
  .route("/members/:userId")
  .patch(
    auth,
    loadPublication,
    publicationMember,
    validMemeber("owner"),
    validate(schema.role),
    publication.changeRole,
  );

export default publicationMembersRouter;
