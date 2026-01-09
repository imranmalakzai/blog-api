import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  userFollowers,
  myFollowers,
  followUser,
  unfollow,
  meFollowing,
  userFollowing,
} from "../controllers/user_follower.controller.js";
import {
  register,
  login,
  username,
  logout,
  users,
  me,
  user,
  changeRole,
  deleteAccount,
  changeAvatar,
  changePassword,
  updateProfile,
  getUsersByRole,
  refreshAccessToken,
} from "../controllers/users.controller.js";
import { allowed } from "../helper/allowedRoles.js";

//**define routed */
const userRouter = express.Router();

//auth endpoints
userRouter.route("/auth/register").post(register);
userRouter.route("/auth/login").post(login);
userRouter.route("/auth/logout").post(logout);
userRouter.route("/auth/refresh").post(refreshAccessToken);

userRouter.use(auth);

//me
userRouter.route("/users/me").get(me);
userRouter.route("/users/me").delete(deleteAccount);
userRouter.route("/users/me").patch(updateProfile);
userRouter.route("/users/me/avatar").patch(changeAvatar);
userRouter.route("/users/me/password").patch(changePassword);
userRouter.route("/users/me/followers").get(myFollowers);
userRouter.route("/users/me/following").get(meFollowing);

// users endpoints
userRouter.route("/users").get(users);
userRouter.route("/users/:userId").get(user);
userRouter.route("/users/@:username").get(username);
userRouter.route("/users/@:username/follow").post(followUser);
userRouter.route("/users/@:username/follow").delete(unfollow);
userRouter.route("/users/@:username/followers").get(userFollowers);
userRouter.route("/users/@:username/following").get(userFollowing);

//admin only
userRouter.route("/users/:userId/role").patch(allowed("admin"), changeRole);
userRouter.route("/users/role").get(allowed("admin"), getUsersByRole); // role ? user | editor | admin
