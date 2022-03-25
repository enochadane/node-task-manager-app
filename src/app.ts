import express from "express";
import "dotenv/config";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

import { authRouter, userRouter, taskRouter } from "./routes/v1/index";

const app = express();

app.use(cors())

app.use(express.json({ limit: "2mb" }));

app.use("/uploads", express.static("uploads"));

app.get("/api", (req, res) => {
  res.status(200).send({ success: true, message: "Welcom to Task App!" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
