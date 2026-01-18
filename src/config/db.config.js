import mysql from "mysql2/promise";

import { DB_NAME, DB_USER, DB_password, HOST_URI } from "./env.config.js";

export const pool = mysql.createPool({
  host: HOST_URI || "localhost",
  user: DB_USER || "root",
  password: DB_password || "",
  database: DB_NAME || "",
  waitForConnections: true,
  connectionLimit: 10, // max simultaneous connections
  queueLimit: 0, // unlimited waiting queries
});
