import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/article_tags.repository.js";
import * as articleDb from "../repository/articals.repsitory.js";

//** add tags in article */
export const create = asyncHandler(async (req, res, next) => {
  const { articleId } = req.params;
  const { tags } = req.body;

  const article = await articleDb.getArticleById(articleId);
  if (!article) throw new ApiError("article not exist", 404);
});
