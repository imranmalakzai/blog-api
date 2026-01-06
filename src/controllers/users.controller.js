import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
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
