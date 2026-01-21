import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  createUserSession,
  logoutFromAllDevices,
  tokenSession,
  deleteSessionByToken,
} from "../repository/users_session.repository.js";
import { genearteRefreshToken, generateAccessToken } from "../utils/jwt.js";
import {
  getUserByEmail,
  updateUserPassword,
  getUserbyId,
  getUserByRole,
  updateRole,
  userRegistration,
  updateUserAvatar,
  getAllUsers,
  getUserByUsername,
  userDeleteAccount,
  updateUserProfile,
} from "../repository/users.repository.js";
import { REFRESH_TOKEN } from "../config/env.config.js";

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
  if (!user) throw new ApiError("Invalid cridential", 401);

  //compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new ApiError("Invalid cridential", 401);

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
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new ApiError("user token is not exist", 204);

  //soft delete
  await deleteSessionByToken(refreshToken);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res
    .status(200)
    .json({ message: "Logout successfully" })
    .clearCookie("refreshToken", options);
});

//** Refresh Token */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = await req.cookies.refreshToken;
  if (!refreshToken)
    throw new ApiError("Invalid token or token is expired", 401);

  const session = await tokenSession(refreshToken);
  if (!session) throw new ApiError("Invalid token  or token is expired", 401);

  //decode token
  const decode = jwt.verify(refreshToken, REFRESH_TOKEN);
  if (!decode) throw new ApiError("Invalid token", 401);

  //extract
  const { id } = decode;

  //find user
  const user = await getUserbyId(id);
  if (!user) throw new ApiError("user not exist", 404);

  //Generate AccessToken
  const accessToken = await generateAccessToken(user);
  if (!accessToken) throw new ApiError("unable to generate AccessToken", 500);

  res.status(200).json({ accessToken });
});

//**Change password */
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  //user exist
  const user = await getUserbyId(req.user.id);
  if (!user) throw new ApiError("user not exist", 404);

  //is password match
  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isMatch) throw new ApiError("Invalid cridential", 401);

  //const result
  const result = await updateUserPassword(newPassword, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  //logout from all devices
  const logout = await logoutFromAllDevices(req.user.id);
  if (logout === 0) throw new ApiError("Internal server error ", 500);

  //cookie options
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res
    .status(200)
    .clearCookie("refreshToken", options)
    .json({ message: "password changed successfully" });
});

//**Change user role Controller */
export const changeRole = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { role } = req.body;

  //user exist
  const user = await getUserByUsername(username);
  if (!user) throw new ApiError("user not exist", 404);

  const result = await updateRole(role, user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "role changed successfully" });
});

//**Get user by role controller */
export const getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const users = await getUserByRole(role);
  res.status(200).json({ users: users || [] });
});

//**Change avatar controller */
export const changeAvatar = asyncHandler(async (req, res) => {
  const avatar_url = req.file?.path;
  const user = await updateUserAvatar(avatar_url, req.user.id);
  if (user === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "Avetar updated successfully" });
});

//**Get all users */
export const users = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.status(200).json({ users });
});

//** Get a user by id */
export const user = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  //user exist
  const user = await getUserbyId(userId);
  if (!user) throw new ApiError("user not exist", 404);

  res.status(200).json({ user });
});

//**get a user by username */
export const username = asyncHandler(async (req, res) => {
  const { username } = req.params;

  //user exist
  const user = await getUserByUsername(username);
  if (!user) throw new ApiError("user not exist", 404);

  res.status(200).json({ user });
});

//**Get current user logged profile */
export const me = asyncHandler(async (req, res) => {
  const user = await getUserbyId(req.user.id);
  if (!user) throw new ApiError("user not exist", 404);
  res.status(200).json({ ...user });
});

//**Delete account user */
export const deleteAccount = asyncHandler(async (req, res) => {
  const result = await userDeleteAccount(req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res
    .status(200)
    .clearCookie("refreshToken", options)
    .json({ message: "Account deleted successfully" });
});

//** UPdate profile (bio,username) */
export const updateProfile = asyncHandler(async (req, res) => {
  const { bio, username } = req.body;

  //is username exist
  const user = await getUserByUsername(username);
  if (user && user.id.toString() !== req.user.id.toString())
    throw new ApiError("username exist", 403);

  const result = await updateUserProfile({ bio, username }, req.user.id);
  if (result === 0) throw new ApiError("Internal server error", 500);

  res.status(200).json({ message: "profile updated successfully" });
});
