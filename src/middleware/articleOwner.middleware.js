import * as articles from "../repository/articals.repsitory.js";
import ApiError from "../utils/apiError.js";

export const requireArticleOwnerIfWriter = async (req, res, next) => {
  const { articleSlug } = req.params;

  try {
    // Only restrict writers
    if (req.publicationRole !== "writer") {
      const article = await articles.getArticleBySlug(articleSlug);
      if (!article) throw new ApiError("Article not exist", 404);
      req.article = article;
      return next();
    }

    const article = await articles.getArticleBySlug(articleSlug);
    if (!article) throw new ApiError("Article not exist", 404);

    if (article.author_id !== req.user.id) {
      return res.status(403).json({
        message: "Writers can only modify their own articles",
      });
    }

    // attach article for next middleware/controller
    req.article = article;

    next();
  } catch (err) {
    next(err);
  }
};
