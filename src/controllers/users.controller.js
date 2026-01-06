import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createUserSession } from "../repository/users_session.repository.js";
import { genearteRefreshToken, generateAccessToken } from "../utils/jwt.js";
import {
  getUserByEmail,
  userRegistration,
} from "../repository/users.repository.js";

//** Register users */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //check user exist
  const user = await getUserByEmail(email);
  if (user) throw new ApiError("user already exist", 400);

  //hashpassword
  const password_hash = await bcrypt.hash(password, 10);

  const result = await userRegistration({ username, email, password_hash });
  if (result === 0) throw new ApiError("Internal server error ", 500);

  res.status(201).json({ message: "registration successed" });
});

//** login user as Already registred */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  //user exist
  const user = await getUserByEmail(email);
  if (!user) throw new ApiError("Invalid cridential", 400);

  //compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new ApiError("Invalid cridential", 400);

  //tokens
  const accessToken = await generateAccessToken(user);
  const refreshToken = await genearteRefreshToken(user);
  //user session
  const userSession = await createUserSession({
    user_id: user.id,
    refresh_token: refreshToken,
    user_agent: userAgent,
    ip_address: ipAddress,
  });
  if (userSession === 0) throw new ApiError("Internal server error");
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json({
      accessToken,
      user: {
        user_id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        avatar: user.avatar,
      },
    });
});

//** Logout from a devices */
export const logout = asyncHandler(async (req, res) => {});
