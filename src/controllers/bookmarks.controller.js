import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/bookmarks.repository.js";

//** Book an article */
export const create = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  //check already bookmarked
  const bookmark = await Db.bookmark(articleId, req.user.id);
  if (bookmark) throw new ApiError("Already bookmarked", 400);

  //const bookmarked
  const result = await Db.create(articleId, req.user.id);
  if (!result) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article bookmarked successfully" });
});
