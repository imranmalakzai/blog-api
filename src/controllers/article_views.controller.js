import * as View from "../repository/article_views.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//**Count article views */
export const articleViews = asyncHandler(async (req, res) => {
  const views = await View.articleViews(req.article.id);
  res.status(200).json({ views });
});
