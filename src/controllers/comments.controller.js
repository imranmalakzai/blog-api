import * as Db from "../repository/comments.repository.js";
import ApiError from "../utils/apiError.js";

//**Add comment to an article */
export const comment = asyncHandler(async (req, res) => {
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
