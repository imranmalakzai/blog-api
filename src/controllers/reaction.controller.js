import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as db from "../repository/reactions.repository.js";

//** Create A new reactions */
export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //prevent dublication
  const reaction = await db.getReactionByName(name);
  if (reaction) throw new ApiError("Reaction already exist", 400);

  const result = await db.create(name);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "created successfully" });
});

//** update a reactions */
export const update = asyncHandler(async (req, res) => {
  const { reactionId } = req.params;
  const { name } = req.body;

  //reaction exist
  const reaction = await db.reaction(reactionId);
  if (!reaction) throw new ApiError("Reaction not exist", 404);

  //update
  const result = await db.update(name, reactionId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "reaction updated successfully" });
});

//** Get all reactions */
export const reactions = asyncHandler(async (req, res) => {
  const result = await db.reactions();
  res.status(200).json({ reactions: result || [] });
});

//**GEt a reaction by Id */
export const reaction = asyncHandler(async (req, res) => {
  const { reactionId } = req.params;

  //reaction exist
  const reaction = await db.reaction(reactionId);
  if (!reaction) throw new ApiError("Reaction not exist", 404);

  res.status(200).json({ reaction });
});

//** Delete a reaction (we use remove here -> delete is a keyword) */
export const remove = asyncHandler(async (req, res) => {
  const { reactionId } = req.params;

  //reaction exist
  const reaction = await db.reaction(reactionId);
  if (!reaction) throw new ApiError("Reaction not exist", 404);

  //result
  const result = await db.remove(reactionId);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "reaction deleted successfully" });
});
