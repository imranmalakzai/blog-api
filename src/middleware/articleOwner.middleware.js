import * as articles from "../repository/articals.repsitory.js";

export const requireArticleOwnerIfWriter = async (req, res, next) => {
  try {
    // Only restrict writers
    if (req.publicationRole !== "writer") {
      return next();
    }

    const { articleSlug } = req.params;

    const article = await articles.getArticleBySlug(articleSlug);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

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
