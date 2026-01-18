import express from "express";
import { CORS_ORIGIN } from "./config/env.config.js";
import { globleErrorHandlerMiddleWare } from "./middleware/globleErrorHandler.middelware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
//**Swagger setup */
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";

//** import API endpoints  */
import userRouter from "./routes/users.route.js";

const app = express();

// important middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: CORS_ORIGIN }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//app route endpoints
app.use("/api/", userRouter);

// swagger docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//  Swagger JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

//health endpoint
app.get("/", (req, res) => {
  res.send("API is working fine");
});

//custom middlewares
app.use(globleErrorHandlerMiddleWare);

export default app;
