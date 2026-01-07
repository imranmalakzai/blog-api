import slugify from "slugify";
import { asyncHandler } from "../utils/asyncHandler.js";
import { publicationById } from "../repository/publication.repository.js";
import { isPublicationMemeber } from "../repository/publication_members.repository.js";
import { createArticle } from "../repository/articals.repsitory.js";
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
