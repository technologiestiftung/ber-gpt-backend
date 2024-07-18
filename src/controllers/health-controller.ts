import { Request, Response } from "express";
import { HealthResponse } from "../types/health-types";

export const getHealthStatus = (
  req: Request,
  res: Response<HealthResponse>
) => {
  res.json({ status: "healthy", time: new Date() });
};
