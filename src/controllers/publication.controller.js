import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/publication.repository.js";
import slugify from "slugify";
import { tr } from "zod/locales";

//** create a new publications */
export const create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //check for dublication slug
  const publication = await Db.publicationBySlug(slug);
  if (publication) throw new ApiError("publication name is taken", 403);

  //add slug
  const newSlug = slugify(slug, { lower: true, trim: true, strict: true });

  //create
  const result = await Db.create({
    name,
    description,
    slug: newSlug,
    user_id: req.user.id,
  });
  if (!result.lenght) throw new ApiError("Internal server error, 500");

  res.status(201).json({ message: "publication created successfully" });
});
