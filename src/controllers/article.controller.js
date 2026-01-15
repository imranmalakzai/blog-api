import slugify from "slugify";
import { NOTIFICATION_TYPES } from "../constant/notification.js";
import * as Notification from "../repository/notification.repository.js";
import * as Db from "../repository/articals.repsitory.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

//** Person Articles crud */
export const create = asyncHandler(async (req, res) => {
  const { title, excerpt, content, status, visibility } = req.body;
  const slug = slugify(title, { strict: true, trim: true, lower: true });

  if (status === "published") {
    //create article
    const article = await Db.createArticle({
      author: req.user.id,
      title,
      excerpt,
      content,
      slug,
      status,
      visibility,
      published_at: true,
    });

    if (!article.lenght) throw new ApiError("Internal server error", 500);
    await Notification({
      user_id: req.user.id,
      actor_id: null,
      type: NOTIFICATION_TYPES.ARTICLE_PUBLISH,
      entity_id: article,
    });
  }

  //create article in drift
  const article = await Db.createArticle({
    author: req.user.id,
    title,
    slug,
    excerpt,
    content,
    status,
    visibility,
    published_at: false,
  });
  if (!article.lenght) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article created successfully" });
});
