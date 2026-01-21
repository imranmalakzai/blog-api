/***
 *
 * Every comment belong to an article so here we check for tow things
 * 1: comment exist ?
 * 2: Dose commen belong to the article
 *
 * req.article contain the article // You can use seperate query here too the comment and article
 */

import ApiError from "../utils/apiError.js";
import * as Comment from "../repository/comments.repository.js";
export const commentMiddleware = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.getCommentById(commentId);
    if (
      !comment ||
      !comment.article_id.toString() === req.article.id.toString()
    ) {
      throw new ApiError("comment or article not exist", 404);
    }
    req.comment = comment;
    next();
  } catch (error) {
    next(error);
  }
};
