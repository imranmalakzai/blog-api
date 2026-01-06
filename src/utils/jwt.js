import jwt from "jsonwebtoken";
import {
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRE,
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRE,
} from "../config/env.config.js";

//**Genearte access Token */
export const generateAccessToken = async (user) => {
  const token = jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });
  return token;
};

//**Generate Refresh Token */
export const genearteRefreshToken = async (user) => {
  const token = jwt.sign({ id: user.id }, REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });
  return token;
};
