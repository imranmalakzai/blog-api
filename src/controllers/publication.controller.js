import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/publication.repository.js";
import slugify from "slugify";
import { pick } from "zod/mini";

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

//** Update a publication */
export const update = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;
  const { name, description } = req.body;

  //publication exist
  const publication = await Db.publicationById(publicationId);
  if (publication) throw new ApiError("publication not exist", 404);

  if (publication.owner_id.toString() !== req.user.id.toString()) {
    throw new ApiError("Access denied", 403);
  }

  const slug = slugify(name, { trim: true, lower: true, strict: true });

  //check for the publication
  const isExist = await Db.publicationBySlug(slug);
  if (isExist && isExist.id.toString() !== publication.toString()) {
    throw new ApiError("publicatin name exist", 400);
  }
  const result = await Db.updatePublications({ name, slug, description });

  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "publication updated successfully" });
});

/**Delete a publication */
export const deletePublication = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;

  //publication exist
  const publication = await Db.publicationById(publicationId);
  if (!publication) throw new ApiError("publicaiton not exist", 404);

  if (publication.owner_id.toString() !== req.user.id.toString()) {
    throw new ApiError("Access denied", 403);
  }

  const result = await Db.deletePublication(publicationId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "publication deleted successfully" });
});
