import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { getUserbyId } from "../repository/users.repository.js";
import {
  follow,
  isFollowing,
  following,
  unFollow,
  followers,
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

//** Un follow a user */
export const unfollow = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await getUserbyId(userId);
  if (!user) throw new ApiError("user not exist");

  // is following
  const following = await isFollowing(req.user.id, userId);
  if (!following) throw new ApiError("please follow first", 403);

  const unfollowed = await unFollow(req.user.id, userId);
  if (unfollowed === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "unfollwed" });
});

//** My follwers */
export const myFollowers = asyncHandler(async (req, res) => {
  const follwers = await followers(req.user.id);
  res.status(200).json({ users: follwers || [] });
});

//** I follow  users */
export const meFollowing = asyncHandler(async (req, res) => {
  const follow = await following(req.user.id);
  res.status(200).json({ users: follow || [] });
});
