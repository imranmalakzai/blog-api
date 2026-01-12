import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as Db from "../repository/article_views.repository.js";
import * as articleDb from "../repository/articals.repsitory.js";

//**count view controller */
export const create = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  //article exist
  const article = await articleDb.getArticleById(articleId);
  if (!article) throw new ApiError("Article not exist");

  const ip_address = req.ip;
  const read_time = 1;

  const result = await Db.create({
    article_id: articleId,
    ip_address,
    read_time,
    user_id: req.user.id,
  });

  if (result) throw new ApiError("Internal server error,", 500);
  res.status(200).json({ message: "article viewd" });
});
