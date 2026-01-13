import * as Db from "../repository/comments.repository.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler";
import * as commentDb from "../repository/comments.repository.js";

//**Add comment to an article */
export const create = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;

  const result = await Db.createComment({
    article_id: articleId,
    user_id: req.user.id,
    content,
  });

  if (!result.lenght) throw new ApiError("Internal server error", 500);
  res.status(201).json({ message: "comment added successfully" });
});

//** comment an article comment */
export const commentCreate = asyncHandler(async (req, res) => {
  const { articleId, commentId } = req.params;
  const { content } = req.body;

  //comment exist
  const comment = await commentDb.getCommentById(commentId);

  if (!comment || !comment.articleId.toString() !== articleId.toString()) {
    throw new ApiError("comment or article not exist", 404);
  }

  // result
  const result = await Db.createComment({
    article_id: articleId,
    user_id: req.user.id,
    content,
    parentId: commentId,
  });
  if (!result.lenght) throw new ApiError("Internal server error", 500);
  res.status(201).json({ message: "comment added an a comment" });
});
