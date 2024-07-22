import cookieParser from "cookie-parser";
import express from "express";
import basicAuthMiddleware from "./middleware/basic-auth-middleware";
import corsMiddleware from "./middleware/cors";
import rateLimitMiddleware from "./middleware/rate-limit";
import authRoutes from "./routes/auth-routes";
import chatRoutes from "./routes/chat-routes";
import chatWithDocumentRoutes from "./routes/chat-with-document-routes";
import healthRoutes from "./routes/health-routes";
import { Config } from "./types/config-types";
import { parseConfig } from "./utils/parse-config";
import bodyParser from "body-parser";

const config: Config = parseConfig();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(corsMiddleware(config));
app.use(rateLimitMiddleware(config));
app.use(basicAuthMiddleware(config));

app.use("/", healthRoutes);
app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);
app.use("/chat-with-document", chatWithDocumentRoutes);

app.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});
