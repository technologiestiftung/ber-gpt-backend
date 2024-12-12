// Make sure that config is parsed first before it is used in the middleware and routes.
import { parseConfig } from "./utils/parse-config";
export const config: Config = parseConfig();

import express from "express";
import basicAuthMiddleware from "./middleware/basic-auth-middleware";
import corsMiddleware from "./middleware/cors";
import rateLimitMiddleware from "./middleware/rate-limit";
import chatRoutes from "./routes/chat-routes";
import documentRoutes from "./routes/document-routes";
import healthRoutes from "./routes/health-routes";
import { Config } from "./types/config-types";
import modelRoutes from "./routes/model-routes";

const app = express();
const port = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(basicAuthMiddleware);

app.use("/", healthRoutes);
app.use("/chat", chatRoutes);
app.use("/documents", documentRoutes);
app.use("/models", modelRoutes);

app.listen(port, () => {
  console.info(`Server is running on port ${port}...`);
});
