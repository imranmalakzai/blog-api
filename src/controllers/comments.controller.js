import * as Db from "../repository/comments.repository.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler";
import * as commentDb from "../repository/comments.repository.js";
import * as articleDb from "../repository/articals.repsitory.js";
import * as Notification from "../repository/notification.repository.js";
import { NOTIFICATION_TYPES } from "../constant/notification.js";

//**Add comment to an article */
export const create = asyncHandler(async (req, res) => {
  const { articleSlug } = req.params;
  const { content, parentId } = req.body;

  //article exist
  const article = await articleDb.getArticleBySlug(articleSlug);
  if (!article) throw new ApiError("Article not exist", 404);

  const result = await Db.createComment({
    article_id: article.id,
    user_id: req.user.id,
    parent_id: parentId || null,
    content,
  });

  if (!result.lenght) throw new ApiError("Internal server error", 500);
  await Notification.create({
    user_id: article.id,
    actor_id: req.user.id,
    type: NOTIFICATION_TYPES.COMMENT,
    entiry_id: result.id,
  });
  res.status(201).json({ message: "comment added successfully" });
});

//** Update a comment */
export const update = asyncHandler(async (req, res) => {
  const { articleSlug, commentId } = req.params;
  const { content } = req.body;

  // article exist
  const article = await articleDb.getArticleBySlug(articleSlug);
  if (!article) throw new ApiError("article not exist", 404);

  //comment exist
  const comment = await commentDb.getCommentById(commentId);

  if (!comment || !comment.articleId.toString() !== article.id.toString()) {
    throw new ApiError("comment or article not exist", 404);
  }

  // id owner
  if (comment.user_id.toString() !== req.user.id.toString()) {
    throw new ApiError("Access denied", 403);
  }

  const result = await Db.updateComment(content, comment.id);
  if (!result.lenght) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "comment updated successfully" });
});

//** Delete a comment */
export const remove = asyncHandler(async (req, res) => {
  const { articleSluge, commentId } = req.params;

  //article exist
  const article = await articleDb.getArticleBySlug(articleSluge);
  if (!article) throw new ApiError("Article not exist", 404);
  //comment exist
  const comment = await commentDb.getCommentById(commentId);

  if (!comment || !comment.articleId.toString() !== article.id.toString()) {
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
  const { articleSlug } = req.params;

  const article = await articleDb.getArticleBySlug(articleSlug);
  if (!article) throw new ApiError("article not exist", 404);

  const comments = await Db.articleComments(article.id);

  res.status(200).json({ comments });
});

//** Get a comment by  */
export const comment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { commentId } = req.params;

  //comment exist
  const comment = await Db.getCommentById(commentId);

  if (!comment || !comment.article_id.toString() === articleId.toString()) {
    throw new ApiError("Article or comment not exist", 404);
  }

  res.status(200).json({ comment });
});
