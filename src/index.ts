import express from "express";
import corsMiddleware from "./middleware/cors";
import healthRoutes from "./routes/health-routes";
import chatRoutes from "./routes/chat-routes";
import rateLimitMiddleware from "./middleware/rate-limit";
import { Config } from "./types/config-types";
import { parseConfig } from "./utils/parse-config";

const config: Config = parseConfig();

const app = express();
const port = 3000;

app.use(express.json());
app.use(corsMiddleware(config));
app.use(rateLimitMiddleware(config));
app.use("/", healthRoutes);
app.use("/chat", chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
