import * as Db from "../repository/comments.repository.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as commentDb from "../repository/comments.repository.js";
import * as Notification from "../repository/notification.repository.js";
import { NOTIFICATION_TYPES } from "../constant/notification.js";

//**Add comment to an article */
export const create = asyncHandler(async (req, res) => {
  const { content, parentId } = req.body;

  const result = await Db.createComment({
    article_id: req.article.id,
    user_id: req.user.id,
    parent_id: parentId || null,
    content,
  });

  if (result === 0) throw new ApiError("Internal server error", 500);

  await Notification.create({
    user_id: req.user.id,
    actor_id: req.user.id,
    type: NOTIFICATION_TYPES.COMMENT,
    entity_id: result,
  });
  res.status(201).json({ message: "comment added successfully" });
});

//** Update a comment */
export const update = asyncHandler(async (req, res) => {
  const { content } = req.body;

  // id owner
  if (req.comment.user_id.toString() !== req.user.id.toString()) {
    throw new ApiError("Access denied", 403);
  }

  const result = await Db.updateComment(content, comment.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "comment updated successfully" });
});

//** Delete a comment */
export const remove = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  //comment exist
  const comment = await commentDb.getCommentById(commentId);

  if (!comment || !comment.articleId.toString() !== req.article.id.toString()) {
    throw new ApiError("comment or or not belong to the article", 404);
  }

  // id owner
  if (comment.user_id.toString() !== req.user.id.toString()) {
    throw new ApiError("Access denied", 403);
  }

  //result
  const result = await Db.deleteComment(comment.id);
  if (!result.lenght) throw new ApiError("Internal server error, 500");

  res.status(200).json({ message: "Comment deleted successfully" });
});

//**Get all comment of on article */
export const comments = asyncHandler(async (req, res) => {
  const comments = await Db.articleComments(req.article.id);
  res.status(200).json({ comments });
});

//** Get a comment by  */
export const comment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  //comment exist
  const comment = await Db.getCommentById(commentId);

  if (!comment || !comment.article_id.toString() === req.articleId.toString()) {
    throw new ApiError("Article or comment not exist", 404);
  }

  res.status(200).json({ comment });
});
