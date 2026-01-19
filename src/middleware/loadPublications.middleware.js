import { publicationBySlug } from "../repository/publication.repository.js";
import ApiError from "../utils/apiError.js";
export const loadPublication = async (req, res, next) => {
  const { publicationSlug } = req.params;
  const publication = await publicationBySlug(publicationSlug);
  if (!publication) {
    throw new ApiError("publication not exist", 404);
  }
  req.publication = publication;
  next();
};
