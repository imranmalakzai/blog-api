import { asyncHandler } from "../utils/asyncHandler.js";
import * as publicationDb from "../repository/publication.repository.js";
import * as Db from "../repository/publication_members.repository.js";
import ApiError from "../utils/apiError.js";

//** Join to a publication */
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

//** leave a publicatin or remove a publication */
export const remove = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;

  // is memeber of publication
  const member = await Db.isPublicationMemeber(publicationId, req.user.id);
  if (!member) throw new ApiError("not publication member");

  //result
  const result = await Db.deletePublicationMember(req.user.id);
  if (result === 0) throw new ApiError("Internal server error,", 500);

  res.status(200).json({ message: "removed publication memebership" });
});

//** Get publiction memebers users */
export const memebers = asyncHandler(async (req, res) => {
  const { publicationId } = req.params;

  const publication = await publicationDb.publicationById(publicationId);
  if (!publication) throw new ApiError("publication not exist");

  const memebers = await Db.publicationMemebers(publicationId);

  res.status(200).json({ memebers: memebers || [] });
});

//**Change memeber role of a publication */
export const changeRole = asyncHandler(async (req, res) => {
  const { publicationId, userId } = req.params;
  const { role } = req.body;

  //is memeber
  const memeber = await Db.isPublicationMemeber(publicationId, userId);
  if (!memeber) throw new ApiError("user is not memeber of publication", 404);

  // change role
  const result = await Db.changePublicationMemberRole(role, userId);
  if (!result.lenght) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "role changed successfully" });
});
