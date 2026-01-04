import env from "dotenv";

env.configDotenv({ path: `.env.${"production" || "development"}.local` });

export const { PORT } = process.env;
