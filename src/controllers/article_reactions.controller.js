import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as reactionDb from "../repository/reactions.repository.js";
import * as articleDb from "../repository/articals.repsitory.js";
import * as db from "../repository/article_rection.repository.js";
import * as Notification from "../repository/notification.repository.js";
import { NOTIFICATION_TYPES } from "../constant/notification.js";

//** like an article */
export const create = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { reactionId } = req.body;

  //article exist
  const article = await articleDb.getArticleById(articleId);
  if (!article) throw new ApiError("article not exist", 404);

  // reaction exist
  const reaction = await reactionDb.reaction(reactionId);
  if (!reaction) throw new ApiError("Invalid reaction", 404);

  //check reaction exist
  const isExist = await db.userReacion(req.user.id, articleId);

  //check user reacted again ? the same then remove the reaction
  if (isExist && isExist.reaction_id.toString() === reaction.id.toString()) {
    const remove = await db.remove(req.user.id, reaction.id);
    if (remove === 0) throw new ApiError("Internal server error", 500);
    await res.status(200).json({ message: "Reaction removed successfully" });
  }

  //check if the reaction is defferent
  if (isExist && isExist.reaction_id.toString() !== reaction.id.toString()) {
    const update = await db.update(req.user.id, articleId, reactionId);
    if (update === 0) throw new ApiError("Internal server error");
    res.status(200).json({ message: "recation updated" });
  }

  //no react yest ?
  const result = await db.createLikeArticle({
    user_id: req.user.id,
    article_id: articleId,
    reaction_id: reactionId,
  });

  if (!result) throw new ApiError("Internal server error", 500);
  await Notification.create({
    user_id: article.author_id,
    actor_id: req.user.id,
    type: NOTIFICATION_TYPES.ARTICLE_LIKE,
    entiry_id: article.id,
  });

  res.status(200).json({ message: "Reaction added" });
});

//** get all likes on an article */
export const likes = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  //article exist
  const article = await articleDb.getArticleById(articleId);
  if (!article) throw new ApiError("article not exist", 404);

  //result
  const likes = await db.usersLikedArticle(articleId);
  res.status(200).json({ likes: likes || [] });
});
