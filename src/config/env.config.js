import env from "dotenv";

env.configDotenv({ path: `.env.${"production" || "development"}.local` });

export const {
  DB_NAME,
  DB_USER,
  DB_password,
  HOST_URI,
  PORT,
  CORS_ORIGIN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRE,
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRE,
} = process.env;
