import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import * as fl from "../controllers/user_follower.controller.js";
import * as cr from "../controllers/users.controller.js";
import { allowed } from "../helper/allowedRoles.js";
import * as Notifications from "../controllers/notification.controller.js";

//**validation schema files */
import { validate } from "../config/zod.config.js";
import * as schema from "../validation/user.schema.js";
import { upload } from "../config/multer.config.js";

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
userRouter.route("/users/me").patch(validate(schema.profile), cr.updateProfile);

userRouter.route("/users/me/notifications").get(Notifications.notifications);

//read && get notifcation
userRouter
  .route("/users/me/notifications/notificationId/read")
  .get(Notifications.notification);

//read all notifications
userRouter
  .route("/users/me/notifications/:notificationId/read-all")
  .post(Notifications.readAll);

// delete a notification
userRouter
  .route("/users/me/notifications/:notificationId")
  .delete(Notifications.remove);

//change avatar
userRouter
  .route("/users/me/avatar")
  .patch(upload.single("avatar"), cr.changeAvatar);

//change password
userRouter
  .route("/users/me/password")
  .patch(validate(schema.password), cr.changePassword);

userRouter.route("/users/me/followers").get(fl.myFollowers);
userRouter.route("/users/me/following").get(fl.meFollowing);

// users endpoints
userRouter.route("/users").get(cr.users);
userRouter.route("/users/@:username").get(cr.username);
userRouter.route("/users/@:username/follow").post(fl.followUser);
userRouter.route("/users/@:username/follow").delete(fl.unfollow);
userRouter.route("/users/@:username/followers").get(fl.userFollowers);
userRouter.route("/users/@:username/following").get(fl.userFollowing);

//admin only
userRouter
  .route("/users/@:username/role")
  .patch(allowed("admin"), validate(schema.role), cr.changeRole);
userRouter.route("/users/role").get(allowed("admin"), cr.getUsersByRole); // role ? user | editor | admin

export default userRouter;
