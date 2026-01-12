import { asyncHandler } from "../utils/asyncHandler.js";
import slugify from "slugify";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/article_tags.repository.js";
import * as articleDb from "../repository/articals.repsitory.js";
import * as tagsDb from "../repository/tags.repository.js";

//** add tags in article */
export const create = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { tags } = req.body;

  if (!Array.isArray(tags)) throw new ApiError("Tage must be an array", 400);
  //Get existing tags
  const existingTags = await tagsDb.tags(tags);
  const tagIds = await existingTags.map((tag) => tag.id);

  //Insert new tags
  for (const tagI of tagIds) {
    await Db.create(articleId, tagI);
  }

  res.status(200).json({ message: "Tags Added successfully" });
});

//** article tags */
export const articleTags = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const tags = await Db.articleTags(articleId);
  res.status(200).json({ tags });
});
