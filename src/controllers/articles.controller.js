import slugify from "slugify";
import { asyncHandler } from "../utils/asyncHandler.js";
import { publicationById } from "../repository/publication.repository.js";
import { isPublicationMemeber } from "../repository/publication_members.repository.js";
import {
  createArticle,
  getArticleById,
  deleteArticle,
} from "../repository/articals.repsitory.js";
import ApiError from "../utils/apiError.js";

//** create a new article */
export const createNewArticle = asyncHandler(async (req, res) => {
  const { publicationId, title, excerpt, status, visibility, content } =
    req.body;

  // is publication exist
  if (publicationId) {
    const publication = await publicationById(publicationId);
    if (!publication) throw new ApiError("publication not exist", 404);

    //is member of the publication
    const member = await isPublicationMemeber(publicationId, req.user.id);
    if (!member) throw new ApiError("Access denied not memeber ", 403);
  }

  const slug = slugify(title, { trim: true, strict: true, lower: true });

  //isPublished
  let isPublished = false;

  if (status === "published") isPublished = true;

  //create article
  const article = await createArticle({
    publication_id: publicationId || null,
    excerpt,
    status,
    visibility,
    content,
    slug,
    published_at: isPublished,
    author_id: req.user.id,
  });

  if (!article) throw new ApiError("Internal server error", 500);
  res.status(200).json({ message: "article created successfully" });
});

//**Delete article */
export const deleteAnArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  //is article exist
  const article = await getArticleById(articleId);
  if (!article) throw new ApiError("article not exist", 404);

  // is owner
  const owner = article.author_id.toString() === req.user.id.toString();

  // publication owner
  const publictionOwner = await publicationById(
    article.publication_id && req.user.id
  );

  if (!owner && !publictionOwner) {
    throw new ApiError("Access denied", 404);
  }

  //soft delete article
  const result = await deleteArticle(articleId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article delete successfully" });
});
