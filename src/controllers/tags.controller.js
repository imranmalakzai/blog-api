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
  if (!result.lenght) throw new ApiError("Internal server error", 500);

  res.status(201).json({ message: "Tag created successfully" });
});
