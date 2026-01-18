import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as fl from "../controllers/user_follower.controller.js";
import * as cr from "../controllers/users.controller.js";
import { allowed } from "../helper/allowedRoles.js";

//**validation schema files */
import { validate } from "../config/zod.config.js";
import * as schema from "../validation/user.schema.js";

//**define routed */
const userRouter = express.Router();

//auth endpoints
userRouter.route("/auth/register").post(validate(schema.register), cr.register);
userRouter.route("/auth/login").post(validate(schema.login), cr.login);
userRouter.route("/auth/logout").post(cr.logout);
userRouter.route("/auth/refresh").post(cr.refreshAccessToken);

userRouter.use(auth);

//me
userRouter.route("/users/me").get(cr.me);
userRouter.route("/users/me").delete(cr.deleteAccount);
userRouter.route("/users/me").patch(cr.updateProfile);
userRouter.route("/users/me/avatar").patch(cr.changeAvatar);
userRouter.route("/users/me/password").patch(cr.changePassword);
userRouter.route("/users/me/followers").get(fl.myFollowers);
userRouter.route("/users/me/following").get(fl.meFollowing);

// users endpoints
userRouter.route("/users").get(cr.users);
userRouter.route("/users/:userId").get(cr.user);
userRouter.route("/users/@:username").get(cr.username);
userRouter.route("/users/@:username/follow").post(fl.followUser);
userRouter.route("/users/@:username/follow").delete(fl.unfollow);
userRouter.route("/users/@:username/followers").get(fl.userFollowers);
userRouter.route("/users/@:username/following").get(fl.userFollowing);

//admin only
userRouter.route("/users/:userId/role").patch(allowed("admin"), cr.changeRole);
userRouter.route("/users/role").get(allowed("admin"), cr.getUsersByRole); // role ? user | editor | admin
