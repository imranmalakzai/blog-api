import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  register,
  login,
  logout,
  users,
  user,
} from "../controllers/users.controller.js";

//**define routed */
const userRouter = express.Router();

//auth endpoints
userRouter.route("/auth/register").post(register);
userRouter.route("/auth/login").post(login);
userRouter.route("/auth/logout").post(logout);

// users endpoints
userRouter.route("/users").get(users);
userRouter.route("/users/:userId").get(user);
userRouter.route("/users/@:username");
