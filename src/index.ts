import express from "express";
import corsMiddleware from "./middleware/cors";
import healthRoutes from "./routes/health-routes";
import chatRoutes from "./routes/chat-routes";
import rateLimitMiddleware from "./middleware/rate-limit";

const app = express();
const port = 3000;

app.use(corsMiddleware);
app.use(express.json());
app.use(rateLimitMiddleware);
app.use("/", healthRoutes);
app.use("/chat", chatRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
