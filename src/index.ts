import express from "express";
import corsMiddleware from "./middleware/cors";
import healthRoutes from "./routes/health-routes";
import chatRoutes from "./routes/chat-routes";
import rateLimitMiddleware from "./middleware/rate-limit";
import { Config } from "./types/config-types";
import { parseConfig } from "./utils/parse-config";
import authRoutes from "./routes/auth-routes";
import { checkAuth } from "./middleware/auth-middleware";
import cookieParser from "cookie-parser";
import chatWithDocumentRoutes from "./routes/chat-with-document-routes";
const bodyParser = require("body-parser");

const config: Config = parseConfig();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(corsMiddleware(config));
app.use(rateLimitMiddleware(config));
app.use("/", healthRoutes);
app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);
app.use("/chat-with-document", chatWithDocumentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
