import { asyncHandler } from "../utils/asyncHandler.js";
import * as publicationDb from "../repository/publication.repository.js";
import * as Db from "../repository/publication_members.repository.js";
import ApiError from "../utils/apiError.js";

//** Join && and cancel from a publication */
export const create = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;

  //is publication exist
  const publication = await publicationDb.publicationById(publicationId);
  if (!publication) throw new ApiError("publication not exist", 404);

  //is publicatin memeber
  const memeber = await Db.isPublicationMemeber(publicationId, req.user.id);
  if (memeber) throw new ApiError("user already memeber of publication");
  const result = await Db.createPublicationMember({
    publication_id: publicationId,
    user_id: req.user.id,
  });
  if (!result.lenght) throw new ApiError("Internal server error", 500);
  res.status(200).json({ message: "Join to publication successed" });
});
