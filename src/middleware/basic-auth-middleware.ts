import { Request, Response, NextFunction } from "express";

const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const xApiKeyInHeader = req.headers["x-api-key"];

  if (!xApiKeyInHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const validXApiKey = process.env.X_API_KEY;

  console.log(xApiKeyInHeader, validXApiKey);
  if (xApiKeyInHeader !== validXApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

export default basicAuthMiddleware;
