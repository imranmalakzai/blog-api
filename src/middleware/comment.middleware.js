import ApiError from "../utils/apiError.js";
import * as Comment from "../repository/comments.repository.js";
export const commentMiddleware = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.getCommentById(commentId);
    if (!comment) throw new ApiError("Comment not exist", 404);
    req.comment = comment;
    next();
  } catch (error) {
    next(error);
  }
};
