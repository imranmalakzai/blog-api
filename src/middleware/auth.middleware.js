import jwt from "jsonwebtoken";
import { ACCESS_TOKEN } from "../config/env.config.js";
import ApiError from "../utils/apiError.js";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("Please authenticate", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, ACCESS_TOKEN);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new ApiError("Invalid or expired token", 401);
  }
};
