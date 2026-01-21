import ApiError from "../utils/apiError.js";
import * as Article from "../repository/articals.repsitory.js";

export const articleMiddleware = async (req, res, next) => {
  try {
    const { articleSlug } = req.params;

    const article = await Article.getArticleBySlug(articleSlug);
    if (!article) throw new ApiError("Article not exist", 404);

    req.article = article;
    next();
  } catch (error) {
    next(error);
  }
};
