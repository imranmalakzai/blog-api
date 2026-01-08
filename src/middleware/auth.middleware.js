import jwt from "jsonwebtoken";
import { ACCESS_TOKEN } from "../config/env.config.js";
import ApiError from "../utils/apiError.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer")) {
    throw new ApiError("please authenticate", 401);
  }
  const token = header.split(" ")[1];
  const decode = jwt.verify(token, ACCESS_TOKEN);
  if (!decode) throw new ApiError("Invalid token", 401);

  req.user = decode;
  next();
};
