import * as View from "../repository/article_views.repository.js";
import * as articleDb from "../repository/articals.repsitory.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//**Count article views */
export const articleViews = asyncHandler(async (req, res) => {
  const { articleSlug } = req.params;

  //article exist
  const article = await articleDb.getArticleBySlug(articleSlug);
  if (!article) throw new ApiError("Article not exist", 404);

  const views = await View.viewedArticle(article.id);
  res.status(200).json({ views });
});
