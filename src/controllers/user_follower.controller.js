import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { getUserbyId } from "../repository/users.repository.js";
import {
  follow,
  isFollowing,
  isFollowing,
} from "../repository/user_follower.js";

//** Follow A user */
export const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  //user exist
  const user = await getUserbyId(userId);
  if (!user) throw new ApiError("user not exist", 404);

  if (userId.toString() === req.user.id.toString())
    throw ApiError("you can't follow your self", 403);

  //prevent from dublication following
  const following = await isFollowing(req.user.id, userId);
  if (following) throw new ApiError("user aready followed", 403);

  const result = await follow(req.user.id, userId);
  if (!result) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "following" });
});
