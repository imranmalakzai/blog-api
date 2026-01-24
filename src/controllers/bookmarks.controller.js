import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/bookmarks.repository.js";

//** Book an article */
export const create = asyncHandler(async (req, res) => {
  //check already bookmarked
  const bookmark = await Db.bookmark(req.article.id, req.user.id);
  if (bookmark) throw new ApiError("Already bookmarked", 400);

  //const bookmarked
  const result = await Db.create(req.article.id, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article bookmarked successfully" });
});

//**UnBookmark article */
export const remove = asyncHandler(async (req, res) => {
  //check bookmarked exist
  const bookmark = await Db.bookmark(req.article.id, req.user.id);
  if (!bookmark) throw new ApiError("article is not bookmarked", 400);

  //result
  const result = await Db.remove(req.article.id, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "remove bookmarked" });
});

//**Get all bookmarked articles */
export const bookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Db.bookmarks(req.user.id);
  res.status(200).json({ bookmarks: bookmarks || [] });
});

//**Get a bookmarked article by Id */
export const bookmark = asyncHandler(async (req, res) => {
  const bookmark = await Db.bookmark(req.article.id, req.user.id);
  if (!bookmark) throw new ApiError("article is not bookmarked", 400);

  res.status(200).json({ bookmark });
});
