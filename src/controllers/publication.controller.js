import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/publication.repository.js";
import slugify from "slugify";

//** create a new publications */
export const create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const slug = slugify(name, { lower: true, trim: true, strict: true });

  //check for dublication slug
  const publication = await Db.publicationBySlug(slug);
  if (publication) throw new ApiError("publication name is taken", 403);

  //create
  const result = await Db.create({
    owner_id: req.user.id,
    name,
    description,
    slug: slug,
    user_id: req.user.id,
  });
  if (result === 0) throw new ApiError("Internal server error, 500");

  res.status(201).json({ message: "publication created successfully" });
});

//** Update a publication */
export const update = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (req.publication.owner_id.toString() !== req.user.id.toString()) {
    throw new ApiError("Access denied", 403);
  }

  const slug = slugify(name, { trim: true, lower: true, strict: true });

  //check for the publication
  const isExist = await Db.publicationBySlug(slug);
  if (isExist && isExist.id.toString() !== req.publication.id.toString()) {
    throw new ApiError("publication name exist", 400);
  }
  const result = await Db.updatePublications({ name, slug, description });

  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "publication updated successfully" });
});

/**Delete a publication */
export const remove = asyncHandler(async (req, res) => {
  const { publicationSlug } = req.params;

  //publication exist
  const publication = await Db.publicationBySlug(publicationSlug);
  if (!publication) throw new ApiError("publicaiton not exist", 404);

  //publication owner
  const owner = publication.owner_id.toString() !== req.user.id.toString();
  const amdin = req.user.role === "admin";

  if (!owner && !amdin) throw new ApiError("Access denied", 403);

  const result = await Db.deletePublication(publication.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "publication deleted successfully" });
});

//**Get all publications */
export const publications = asyncHandler(async (req, res) => {
  const publications = await Db.publications();
  res.status(200).json({ publications: publications || [] });
});

//**Get publication by slug */
export const publication = asyncHandler(async (req, res) => {
  const { publicationSlug } = req.params;

  const publication = await Db.publicationBySlug(publicationSlug);
  if (!publication) throw new ApiError("publication not exist", 404);

  res.status(200).json({ publication });
});
