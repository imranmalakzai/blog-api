import express from "express";
import { CORS_ORIGIN } from "./config/env.config.js";

const app = express();

// important middlewares
app.use(express.json());
app.use(cors({ credentials: true, origin: CORS_ORIGIN }));
app.use(express.urlencoded({ extended: true }));

//health endpoint
app.get("/", (req, res) => {
  res.send("API is working fine");
});
