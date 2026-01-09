import slugify from "slugify";
import { asyncHandler } from "../utils/asyncHandler.js";
import { publicationById } from "../repository/publication.repository.js";
import { isPublicationMemeber } from "../repository/publication_members.repository.js";
import { getArticleById } from "../repository/articals.repsitory.js";
import {
  createArticle,
  publishedArticles,
  getAPublicationArticleById,
  getArticleById,
  getPublicArticles,
  getPublicationArticles,
  publishArticle,
  deleteArticle,
  myArticles,
} from "../repository/articals.repsitory.js";
import ApiError from "../utils/apiError.js";
import { getUserbyId } from "../repository/users.repository.js";

//** create a new article in a publication */
export const createNewArticle = asyncHandler(async (req, res) => {
  const { title, excerpt, status, visibility, content } = req.body;
  const { publicationId } = req.params;

  // is publicaiton exist
  const publication = await publicationById(publicationId);
  if (!publication) throw new ApiError("publication not exist", 404);

  // is memeber of publication
  const member = await isPublicationMemeber(publicationId, req.user.id);
  if (!member)
    throw new ApiError("Access denied not publication memeber ", 403);

  const slug = slugify(title, { trim: true, strict: true, lower: true });

  //isPublished
  let isPublished = false;

  if (status === "published") isPublished = true;

  //create article
  const article = await createArticle({
    publication_id: publicationId,
    excerpt,
    status,
    visibility,
    content,
    slug,
    published_at: isPublished,
    author_id: req.user.id,
  });

  if (!article) throw new ApiError("Internal server error", 500);
  res.status(201).json({ message: "article created successfully" });
});

//** create a new article not part of publication */
export const createPublicArticle = asyncHandler(async (req, res) => {
  const { title, excerpt, status, visibility, content } = req.body;

  const slug = slugify(title, { lower: true, strict: true, trim: true });

  //isPublished
  let isPublished = false;

  if (status === "published") isPublished = true;

  //create article
  const article = await createArticle({
    excerpt,
    status,
    visibility,
    content,
    slug,
    published_at: isPublished,
    author_id: req.user.id,
  });

  if (!article) throw new ApiError("Article not exist", 404);
  res.status(201).json({ message: "article created successfully" });
});

//**Delete article A publication Article */
export const deletePublicationArticle = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;
  const { articleId } = req.params;

  //publiction exist
  const publication = await publicationById(publicationId);
  if (!publication) throw new ApiError("publication not exist", 404);

  //article exist
  const article = await getAPublicationArticleById(publication.id, articleId);
  if (!article) throw new ApiError("article not exist");

  //Is post owner
  const owner = article.author_id.toString() === req.user.id.toString();

  //Publication owner
  const publicationOwner = publication.owner_id.toString() === req.user.id;

  if (!owner && !publicationOwner) {
    throw new ApiError("Access denied", 404);
  }

  //soft delete article
  const result = await deleteArticle(articleId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Article delete successfully" });
});
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

//**Update article  in publication (author || editor) */
export const updateArticle = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;
  const { articleId } = req.params;

  //publication exist ?
  const publication = publicationById(publicationId);
  if (!publication) throw new ApiError("publication not exist", 404);

  //article exist ?
  const article = await getAPublicationArticleById(publication.id, articleId);
  if (!article) throw new ApiError("Article not exist", 404);
});

//**Get all articles publish articles*/
export const articles = asyncHandler(async (req, res) => {
  const articles = await getPublicArticles();
  res.status(200).json({ articles: articles || [] });
});

//**Get all articls of a publications */
export const publictionArticles = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;

  //publication exist
  const publication = await publicationById(publicationId);
  if (!publication) throw new ApiError("Publication not exist", 404);

  //const articles
  const articles = await getPublicationArticles(publicationId);

  res.status(200).json({ articles: articles || [] });
});

//** Get a publication Article By Id */
export const publicationArticle = asyncHandler(async (req, res) => {
  const { publicationId, articleId } = req.body;
  const article = await getAPublicationArticleById(publicationId, articleId);
  if (!article) throw new ApiError("article not exist", 404);

  res.status(200).json({ article });
});

//** User Get An Article By Id */
export const userArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  //article exist
  const article = await publishArticle(articleId);
  if (!article) throw new ApiError("Article not exist", 404);

  res.status(200).json({ article });
});

//** Delete article */
export const articleDelete = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await getArticleById(articleId);
  if (!article) throw new ApiError("Article not exist", 404);

  //is author
  const author = req.user.id.toString() === article.author_id.toString();
  const owner = req.user.role === "admin" || "editor";

  if (!author || !owner) throw new ApiError("Access denied", 403);

  const result = await deleteArticle(articleId);
  if (result === 0) throw new ApiError("Internal serer error", 500);

  res.status(200).json({ message: "article delte successfully" });
});

//**PUblished articles */
export const getPublishedArticles = asyncHandler(async (req, res) => {
  const articles = await publishedArticles();
  res.status(200).json({ articles: articles || [] });
});

//** user Articles */
export const userArticles = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  //user exist
  const user = await getUserbyId(userId);
  if (!user) throw new ApiError("user not exist", 404);

  //user articles
  const articles = await myArticles(userId);
  res.status(200).json({ articles: articles || [] });
});
