import { NextFunction, Request, Response } from "express";
import { config } from "..";

const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const xApiKeyInHeader = req.headers["x-api-key"];

  if (!xApiKeyInHeader) {
    return res.status(401).json({
      message: "Unauthorized",
      code: "unauthorized",
      status: 401,
    });
  }

  const validXApiKey = config.xApiKey;

  if (xApiKeyInHeader !== validXApiKey) {
    return res.status(401).json({
      message: "Unauthorized",
      code: "unauthorized",
      status: 401,
    });
  }

  next();
};

export default basicAuthMiddleware;
