import env from "dotenv";

env.configDotenv({ path: `.env.${"production" || "development"}.local` });

export const { DB_NAME, DB_USER, DB_password, HOST_URI } = process.env;
