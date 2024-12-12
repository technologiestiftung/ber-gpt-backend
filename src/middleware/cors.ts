import cors from "cors";
import { config } from "..";

const corsOptions = {
  origin: config.corsAllowedOrigin,
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization,x-api-key,llm",
  optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
