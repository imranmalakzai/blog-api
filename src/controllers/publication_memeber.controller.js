import { asyncHandler } from "../utils/asyncHandler.js";
import * as publicationDb from "../repository/publication.repository.js";
import * as Db from "../repository/publication_members.repository.js";
import ApiError from "../utils/apiError.js";

//** Join to a publication */
export const create = asyncHandler(async (req, res) => {
  //is publicatin memeber
  const memeber = await Db.isPublicationMemeber(
    req.publication.id,
    req.user.id
  );
  if (memeber) throw new ApiError("user already memeber of publication", 403);

  const result = await Db.createPublicationMember({
    publication_id: req.publication.id,
    user_id: req.user.id,
  });
  if (!result.lenght) throw new ApiError("Internal server error", 500);
  res.status(200).json({ message: "Join to publication successed" });
});

//** leave a publication or remove a publication */
export const remove = asyncHandler(async (req, res) => {
  // is memeber of publication
  const member = await Db.isPublicationMemeber(req.publication.id, req.user.id);
  if (!member) throw new ApiError("not publication member", 403);

  //result
  const result = await Db.deletePublicationMember(req.user.id);
  if (result === 0) throw new ApiError("Internal server error,", 500);

  res.status(200).json({ message: "removed publication memebership" });
});

//** Get publiction memebers users */
export const memebers = asyncHandler(async (req, res) => {
  const memebers = await Db.publicationMemebers(req.publication.id);
  res.status(200).json({ memebers: memebers || [] });
});

//**Change memeber role of a publication */
export const changeRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  //is memeber
  const memeber = await Db.isPublicationMemeber(req.user.id, userId);
  if (!memeber) throw new ApiError("user is not memeber of publication", 404);

  // change role
  const result = await Db.changePublicationMemberRole(role, userId);
  if (!result.lenght) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "role changed successfully" });
});

//** All publication that I'm memeber of  */
export const myPublications = asyncHandler(async (req, res) => {
  const publictions = await Db.userPulications(req.user.id);

  res.status(200).json({ publictions: publictions || [] });
});

//**Get all followers of a publications */
export const followers = asyncHandler(async (req, res) => {
  const followers = await Db.publicationFollowers(req.publication.id);
  res.status(200).json({ followers: followers || [] });
});

//**remove from publications */
export const removeUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  //is publication memeber
  const memeber = await Db.isPublicationMemeber(req.publication.id, userId);
  if (!memeber) throw new ApiError("Not publication memeber", 403);

  //result
  const result = await Db.deletePublicationMember(userId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "user removed successfully" });
});
