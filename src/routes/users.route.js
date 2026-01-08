import express from "express";
import { auth } from "../middleware/auth.middleware.js";
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
// users endpoints
userRouter.route("/users").get(users);
userRouter.route("/users/:userId").get(user);
userRouter.route("/users/@:username").get(username);

//me
userRouter.route("/users/me").get(me);
userRouter.route("/users/me").delete(deleteAccount);
userRouter.route("/users/me").patch(updateProfile);
userRouter.route("/users/me/avatar").patch(changeAvatar);
userRouter.route("/users/me/password").patch(changePassword);

//admin only
userRouter.route("/users/:userId/role").patch(allowed("admin"), changeRole);
userRouter.route("/users/role").get(allowed("admin"), getUsersByRole); // role ? user | editor | admin
