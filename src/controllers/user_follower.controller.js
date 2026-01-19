import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { getUserByUsername } from "../repository/users.repository.js";
import * as Notification from "../repository/notification.repository.js";
import { NOTIFICATION_TYPES } from "../constant/notification.js";
import {
  follow,
  isFollowing,
  unFollow,
  followers,
  following,
} from "../repository/user_follower.js";

//** Follow A user */
export const followUser = asyncHandler(async (req, res) => {
  const { username } = req.params;

  //user exist
  const user = await getUserByUsername(username);
  if (!user) throw new ApiError("user not exist", 404);

  if (user.id.toString() === req.user.id.toString())
    throw new ApiError("you can't follow your self", 403);

  //prevent from dublication following
  const following = await isFollowing(req.user.id, user.id);
  if (following) throw new ApiError("user already followed", 403);

  const result = await follow(req.user.id, user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  await Notification.create({
    user_id: user.id,
    actor_id: req.user.id,
    type: NOTIFICATION_TYPES.FOLLOW,
    entity_id: following.id,
  });

  res.status(200).json({ message: "You start following" });
});

//** Un follow a user */
export const unfollow = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await getUserByUsername(username);
  if (!user) throw new ApiError("user not exist");

  // is following
  const following = await isFollowing(req.user.id, user.id);
  if (!following) throw new ApiError("please follow first", 403);

  const unfollowed = await unFollow(req.user.id, user.id);
  if (unfollowed === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "unfollwed" });
});

//** My follwers */
export const myFollowers = asyncHandler(async (req, res) => {
  const follwers = await followers(req.user.id);
  res.status(200).json({ followers: follwers || [] });
});

//** I follow  users */
export const meFollowing = asyncHandler(async (req, res) => {
  const follow = await following(req.user.id);
  res.status(200).json({ users: follow || [] });
});

//** userFollowers */
export const userFollowers = asyncHandler(async (req, res) => {
  const { username } = req.params;

  //is user exist
  const user = await getUserByUsername(username);
  if (!user) throw new ApiError("user not eixst", 404);

  //followers
  const users = await followers(user.id);

  res.status(200).json({ follwers: users || [] });
});

//** user following */
export const userFollowing = asyncHandler(async (req, res) => {
  const { username } = req.params;

  //user exist
  const user = await getUserByUsername(username);
  if (!user) throw new ApiError("user not exist", 404);

  //const following
  const users = await following(user.id);

  res.status(200).json({ following: users || [] });
});
