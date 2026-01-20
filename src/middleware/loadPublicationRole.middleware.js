import { isPublicationMemeber } from "../repository/publication_members.repository.js";
import ApiError from "../utils/apiError.js";

export const publicationMember = async (req, res, next) => {
  try {
    const memeber = await isPublicationMemeber(req.publication.id, req.user.id);
    if (!memeber) throw new ApiError("Not publication memeber", 403);
    req.publicationRole = memeber.role;
    next();
  } catch (error) {
    next(error);
  }
};
