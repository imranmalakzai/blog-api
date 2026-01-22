import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as reactionDb from "../repository/reactions.repository.js";
import * as db from "../repository/article_rection.repository.js";
import * as Notification from "../repository/notification.repository.js";
import { NOTIFICATION_TYPES } from "../constant/notification.js";

//** like an article */
export const react = asyncHandler(async (req, res) => {
  const { reactionId } = req.body;

  const reaction = await reactionDb.reaction(reactionId);
  if (!reaction) throw new ApiError("Invalid reaction", 404);

  const existing = await db.userReaction(req.user.id, req.article.id);

  // SAME reaction → remove
  if (existing && existing.reaction_id === reaction.id) {
    await db.remove(req.user.id, req.article.id);
    return res.status(200).json({ message: "Reaction removed" });
  }

  // DIFFERENT reaction → update
  if (existing && existing.reaction_id !== reaction.id) {
    await db.update(req.user.id, req.article.id, reaction.id);
    return res.status(200).json({ message: "Reaction updated" });
  }

  // NO reaction yet → create
  await db.createLikeArticle({
    user_id: req.user.id,
    articleId: req.article.id,
    reaction_id: reaction.id,
  });

  await Notification.create({
    user_id: req.article.author_id,
    actor_id: req.user.id,
    type: NOTIFICATION_TYPES.ARTICLE_LIKE,
    entity_id: req.article.id,
  });

  res.status(201).json({ message: "Reaction added" });
});

//** get all likes on an article */
export const likes = asyncHandler(async (req, res) => {
  //result
  const likes = await db.usersLikedArticle(req.article.id);
  res.status(200).json({ likes: likes || [] });
});
