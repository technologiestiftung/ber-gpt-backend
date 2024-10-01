import express from "express";
import basicAuthMiddleware from "./middleware/basic-auth-middleware";
import corsMiddleware from "./middleware/cors";
import rateLimitMiddleware from "./middleware/rate-limit";
import chatRoutes from "./routes/chat-routes";
import documentRoutes from "./routes/document-routes";
import healthRoutes from "./routes/health-routes";
import { Config } from "./types/config-types";
import { parseConfig } from "./utils/parse-config";
import modelRoutes from "./routes/model-routes";

export const config: Config = parseConfig();

const app = express();
const port = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(corsMiddleware(config));
app.use(rateLimitMiddleware(config));
app.use(basicAuthMiddleware(config));

app.use("/", healthRoutes);
app.use("/chat", chatRoutes);
app.use("/documents", documentRoutes);
app.use("/models", modelRoutes);

app.listen(port, () => {
  console.info(`Server is running on port ${port}...`);
});
