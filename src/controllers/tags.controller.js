import { asyncHandler } from "../utils/asyncHandler.js";
import slugify from "slugify";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/tags.repository.js";

//**Create tags */
export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { strict: true, lower: true, trim: true });

  //check tag exist by slug
  const tag = await Db.getTagBySlug(slug);
  if (tag) throw new ApiError("tag exist, tag name must be unique", 400);

  //result
  const result = await Db.createTags(name, slug);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(201).json({ message: "Tag created successfully" });
});

//**Update tag */
export const update = asyncHandler(async (req, res) => {
  const { slug } = await req.params;
  const { name } = req.body;

  //const tag exist
  const tag = await Db.getTagBySlug(slug);
  if (!tag) throw new ApiError("Tag not exist", 404);

  const newSlug = slugify(name, { lower: true, strict: true, trim: true });

  // is unique
  const unique = await Db.getTagBySlug(newSlug);
  if (unique && unique.id.toString() !== tag.id.toString()) {
    throw new ApiError("tag exist please select unique tag name", 400);
  }

  const result = await Db.updateTag(tag.id, name, newSlug);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Tag updated successfully" });
});

//** delete a tag */
export const remove = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const tag = await Db.getTagBySlug(slug);
  if (!tag) throw new ApiError("Tag not exist", 404);

  //result
  const result = await Db.deleteATag(tag.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "tag deleted successfully" });
});

//**Get all tags */
export const tags = asyncHandler(async (req, res) => {
  const tags = await Db.getAllTags();
  res.status(200).json({ tags: tags || [] });
});

//** Get a tag by slug*/
export const tag = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  //tag exist
  const tag = await Db.getTagBySlug(slug);
  if (!tag) throw new ApiError("Tag not exist", 404);

  res.status(200).json({ tag });
});
