import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import * as db from "../repository/reactions.repository.js";

//** Create A new reactions */
export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const result = await db.create(name);
  if (result === 0) throw new ApiError("Internal server error", 500);
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
