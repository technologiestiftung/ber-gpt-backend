import { Config } from "./../types/config-types";
import cors from "cors";

const corsMiddleware = (config: Config) => {
  const corsOptions = {
    origin: config.corsAllowedOrigin,
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization,x-api-key",
    optionsSuccessStatus: 200,
  };

  return cors(corsOptions);
};

export default corsMiddleware;
