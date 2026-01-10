import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as reactionDb from "../repository/reactions.repository.js";
import * as articleDb from "../repository/articals.repsitory.js";
import * as db from "../repository/article_rection.repository.js";

//** like an article */
export const create = asyncHandler(async (req, res) => {
  const { artilceId } = req.params;
  const { reactionId } = req.params;

  // article exist
  const article = await articleDb.getArticleById(artilceId);
  if (!article) throw new ApiError("Article not exist", 404);

  // reaction exist
  const reaction = await reactionDb.reaction(reactionId);
  if (!reaction) throw new ApiError("reaction not exist", 404);

  //result
  const result = await db.createLikeArticle({
    user_id: req.user.id,
    article_id: article,
    reaction_id: reactionId,
  });

  if (result === 0) throw new ApiError("Internal server error", 500);
  res.status(200).json({ message: "liked" });
});

//** Unlike an article */
export const remove = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  //article exist
  const article = await articleDb.getArticleById(articleId);
  if (!article) throw new ApiError("Article not exist", 404);

  //result
  const result = await db.unlikeArticle(article, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "unliked" });
});
