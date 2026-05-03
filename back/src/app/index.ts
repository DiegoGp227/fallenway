import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "../routes/index.routes";
import { errorHandler } from "../middlewares/errorHandler.middleware";
import { logger } from "../utils/logger";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:5000",
      "https://fallenway.devdiego.work",
      "http://18.191.112.24:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", router);
app.get("/ping", (req, res) => res.send("pong"));
app.use((req, res) => {
  res.status(404).json({
    message: "Escribe bien mono estupido",
  });
});
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
