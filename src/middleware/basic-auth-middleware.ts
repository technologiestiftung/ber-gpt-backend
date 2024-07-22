import { Request, Response, NextFunction } from "express";
import { Config } from "../types/config-types";

const basicAuthMiddleware =
  (config: Config) => (req: Request, res: Response, next: NextFunction) => {
    const xApiKeyInHeader = req.headers["x-api-key"];

    if (!xApiKeyInHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const validXApiKey = config.xApiKey;

    if (xApiKeyInHeader !== validXApiKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  };

export default basicAuthMiddleware;
